import os
import google.generativeai as genai # type: ignore
import json
import logging
import re
import asyncio
import concurrent.futures
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Thread pool for running blocking Gemini calls
_THREAD_POOL = concurrent.futures.ThreadPoolExecutor(max_workers=10)

def _sync_gemini_call(prompt: str, system_instruction: Optional[str] = None) -> str:
    """
    Synchronous call to Gemini API - will be run in a thread pool
    """
    model = genai.GenerativeModel(model_name="gemini-2.0-flash")
    
    try:
        if system_instruction:
            chat = model.start_chat(history=[])
            response = chat.send_message(
                f"System instruction: {system_instruction}\n\nUser prompt: {prompt}"
            )
        else:
            response = model.generate_content(prompt)
        
        return response.text
    except Exception as e:
        logger.error(f"Error in Gemini API call: {str(e)}")
        raise

async def get_gemini_response(prompt: str, system_instruction: Optional[str] = None, retry_count: int = 2) -> str:
    """
    Get a response from the Gemini model using a thread pool to avoid blocking
    """
    retry = 0
    last_exception = None
    
    while retry <= retry_count:
        try:
            # Run the blocking Gemini call in a thread pool
            loop = asyncio.get_event_loop()
            response_text = await loop.run_in_executor(
                _THREAD_POOL,
                _sync_gemini_call,
                prompt,
                system_instruction
            )
            return response_text
            
        except Exception as e:
            last_exception = e
            retry += 1
            logger.warning(f"Gemini API call failed (attempt {retry}/{retry_count+1}): {str(e)}")
            
            if "overloaded" in str(e).lower() or "503" in str(e):
                # Backoff with jitter for server overload
                backoff_time = (2 ** retry) + (0.1 * asyncio.get_event_loop().time() % 1.0)
                logger.info(f"Model overloaded, backing off for {backoff_time:.2f} seconds...")
                await asyncio.sleep(backoff_time)
            else:
                # For other errors, shorter backoff
                await asyncio.sleep(1)
    
    logger.error(f"All retries failed for Gemini API call: {str(last_exception)}")
    raise Exception(f"Failed to generate content with Gemini after {retry_count+1} attempts: {str(last_exception)}")

# The rest of your functions remain the same
def fix_json(json_str: str) -> str:
    """Attempt to fix common JSON formatting issues."""
    # Fix missing quotes around property names
    json_str = re.sub(r'([{,])\s*(\w+):', r'\1"\2":', json_str)
    
    # Fix trailing commas in arrays and objects
    json_str = re.sub(r',\s*}', '}', json_str)
    json_str = re.sub(r',\s*]', ']', json_str)
    
    # Fix single quotes
    json_str = json_str.replace("'", '"')
    
    # Fix unquoted string values
    json_str = re.sub(r':\s*([a-zA-Z][a-zA-Z0-9_]*)\s*([,}])', r':"\1"\2', json_str)
    
    return json_str

async def get_gemini_structured_response(prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
    """Get a structured JSON response from the Gemini model."""
    try:
        # Add explicit instructions for JSON formatting
        enhanced_system_instruction = """
        You must respond with valid, properly formatted JSON only. 
        No explanations, comments, or text outside the JSON structure.
        """
        
        if system_instruction:
            system_instruction = f"{system_instruction}\n\n{enhanced_system_instruction}"
        else:
            system_instruction = enhanced_system_instruction
            
        # Optimize prompt for JSON output
        json_prompt = prompt + "\n\nOutput must be valid JSON without any commentary, markdown formatting, or code block syntax."
        
        # Get response from Gemini
        response_text = await get_gemini_response(json_prompt, system_instruction)
        
        # Extract JSON from the response
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', response_text)
        if json_match:
            json_str = json_match.group(1)
        else:
            # Try to find JSON between curly braces
            json_start = response_text.find('{')
            json_end = response_text.rfind('}')
            
            if json_start >= 0 and json_end >= 0:
                json_str = response_text[json_start:json_end+1]
            else:
                # Last resort, treat the whole response as potential JSON
                json_str = response_text.strip()
        
        # Try parsing with fallbacks
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            # Try fixing common JSON issues
            fixed_json = fix_json(json_str)
            return json.loads(fixed_json)
    
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {str(e)}")
        raise Exception(f"Failed to parse JSON from Gemini response: {str(e)}")
    except Exception as e:
        logger.error(f"Error in structured response: {str(e)}")
        raise Exception(f"Failed to get structured response from Gemini: {str(e)}")