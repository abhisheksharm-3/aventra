"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  remember: z.boolean().optional().default(false),
})

// Signup form schema
const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, underscores and hyphens" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  remember: z.boolean().optional().default(false),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>

// Mock database for demo purposes
const MOCK_USERS = [
  { username: "demo", email: "user@example.com", password: "password123" }
]

// Completely mock auth state (will reset on server restart)
let MOCK_CURRENT_USER: { username: string; email: string } | null = null;

/**
 * Mock login function that simulates authentication
 * Will be replaced with Appwrite auth later
 */
export async function login(formData: LoginFormValues) {
  try {
    // Validate the form data
    const result = loginSchema.safeParse(formData)
    
    if (!result.success) {
      const errorMessages = result.error.errors.map(err => err.message).join(", ")
      return { success: false, error: errorMessages }
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Check credentials against mock database
    const user = MOCK_USERS.find(user => 
      user.email === formData.email && user.password === formData.password
    )
    
    if (user) {
      // Simulate successful login by updating mock auth state
      MOCK_CURRENT_USER = { 
        username: user.username, 
        email: user.email 
      }
      
      // In a real implementation, this would set a cookie or session
      console.log("User logged in:", MOCK_CURRENT_USER)
      
      revalidatePath("/login")
      return { 
        success: true, 
        user: { username: user.username, email: user.email } 
      }
    } else {
      return { 
        success: false, 
        error: "Invalid email or password. Please try again." 
      }
    }
  } catch (error) {
    console.error("Login error:", error)
    return { 
      success: false, 
      error: "Authentication failed. Please try again later." 
    }
  }
}

/**
 * Mock signup function that simulates user registration
 * Will be replaced with Appwrite auth later
 */
export async function signup(formData: SignupFormValues) {
  try {
    // Validate the form data
    const result = signupSchema.safeParse(formData)
    
    if (!result.success) {
      const errorMessages = result.error.errors.map(err => err.message).join(", ")
      return { success: false, error: errorMessages }
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Check if user already exists
    const userExists = MOCK_USERS.some(user => 
      user.email === formData.email || user.username === formData.username
    )
    
    if (userExists) {
      return { 
        success: false, 
        error: "Account already exists with this email or username." 
      }
    }
    
    // In a real app, you would store the user in your database
    const newUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password
    }
    
    // Temporarily add user to mock database (this will reset on server restart)
    MOCK_USERS.push(newUser)
    
    // Simulate successful registration by updating mock auth state
    MOCK_CURRENT_USER = { 
      username: newUser.username, 
      email: newUser.email 
    }
    
    // In a real implementation, this would set a cookie or session
    console.log("User registered and logged in:", MOCK_CURRENT_USER)
    
    revalidatePath("/login")
    return { 
      success: true, 
      user: { username: formData.username, email: formData.email } 
    }
  } catch (error) {
    console.error("Signup error:", error)
    return { 
      success: false, 
      error: "Registration failed. Please try again later." 
    }
  }
}

/**
 * Helper function to check if user is authenticated
 */
export async function checkAuth() {
  // In a real implementation, this would check cookies or session
  return { 
    authenticated: MOCK_CURRENT_USER !== null,
    user: MOCK_CURRENT_USER || undefined
  }
}

/**
 * Logout function that simulates logging out
 */
export async function logout() {
  // Clear mock auth state
  MOCK_CURRENT_USER = null
  console.log("User logged out")
  
  revalidatePath("/")
  return { success: true }
}