"use server";

import { ID, OAuthProvider } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/services/appwrite/appwrite";
import { z } from "zod"; // For input validation
import { AuthResult } from "@/types/auth";
import { headers } from "next/headers";

/**
 * Authentication response type for consistent return values
 * @typedef {Object} AuthResult
 * @property {boolean} success - Whether the authentication operation succeeded
 * @property {string|undefined} error - Error message if operation failed
 * @property {string|undefined} redirectUrl - Redirect URL for OAuth flows
 */

/**
 * Validates user input for email-based login
 */
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Validates user input for signup
 */
const signupSchema = loginSchema.extend({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
});

/**
 * Helper function to call the cookie API route
 */
async function setCookieViaApi(cookieName: string, value: string, maxAge: number): Promise<void> {
  const userHeaders = await headers();
  const origin = userHeaders.get("origin");
  if (!origin) {
    throw new Error("Invalid request origin");
  }
  const response = await fetch( `${origin}/api/auth/cookies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "set",
      cookieName,
      value,
      options: {
        path: "/",
        maxAge,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      },
    }),
  });

  if (!response.ok) {
    console.error("Failed to set cookie via API:", await response.text());
    throw new Error("Failed to set the session cookie.");
  }
}

/**
 * Creates a new user account with username, email, and password
 *
 * @param {FormData} formData - Form data containing user signup information
 * @returns {Promise<AuthResult>} Authentication response
 */
export async function signUpWithEmail(formData: FormData): Promise<AuthResult> {
  try {
    // Extract and validate form data
    const validationData = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate input data
    const result = signupSchema.safeParse(validationData);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Invalid input data";
      return { success: false, error: errorMessage };
    }

    const { username, email, password } = validationData;

    const { account } = await createAdminClient();

    // Create user account using username as name
    await account.create(ID.unique(), email, password, username);

    // Create session
    const session = await account.createEmailPasswordSession(email, password);

    // Set session cookie via API
    await setCookieViaApi("user-session", session.secret, 60 * 60 * 24 * 7); // 7 days

    return { success: true };
  } catch (error: unknown) {
    console.error("Sign up failed:", error);

    // Handle specific error types if possible
    const errorMessage =
      error instanceof Error ? error.message : "Sign up failed. Please try again.";

    return {
      success: false,
      error: errorMessage.includes("already exists")
        ? "An account with this email already exists."
        : errorMessage,
    };
  }
}

/**
 * Authenticates a user with email and password
 *
 * @param {FormData} formData - Form data containing login credentials
 * @returns {Promise<AuthResult>} Authentication response
 */
export async function loginWithEmail(formData: FormData): Promise<AuthResult> {
  try {
    // Extract and validate form data
    const validationData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate input data
    const result = loginSchema.safeParse(validationData);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Invalid input data";
      return { success: false, error: errorMessage };
    }

    const { email, password } = validationData;
    const { account } = await createAdminClient();

    // Create session
    const session = await account.createEmailPasswordSession(email, password);

    // Set session cookie via API
    await setCookieViaApi("user-session", session.secret, 60 * 60 * 24 * 7); // 7 days

    return { success: true };
  } catch (error: unknown) {
    console.error("Login failed:", error);
    return {
      success: false,
      error: "Invalid email or password. Please try again.",
    };
  }
}

/**
 * Logs out the current user by deleting their session
 *
 * @returns {Promise<AuthResult>} Authentication response
 */
export async function logout(): Promise<AuthResult> {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    const userHeaders = await headers();
    const origin = userHeaders.get("origin");
    if (!origin) {
      throw new Error("Invalid request origin");
    }
    const response = await fetch( `${origin}/api/auth/cookies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "clear",
        cookieName: "user-session",
      }),
    });

    if (!response.ok) {
      console.error("Failed to clear cookie via API:", await response.text());
      throw new Error("Failed to clear the session cookie.");
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Logout failed:", error);
    return {
      success: false,
      error: "Logout failed. Please try again.",
    };
  }
}

/**
 * Creates an OAuth2 token for third-party authentication
 * 
 * @param {OAuthProvider} provider - The OAuth provider (Google, GitHub, etc.)
 * @returns {Promise<AuthResult>} Authentication response with redirect URL
 */
async function createOAuthSession(provider: OAuthProvider): Promise<AuthResult> {
  const { account } = await createAdminClient();
  const userHeaders = await headers();
  const origin = userHeaders.get("origin");
  
  if (!origin) {
    return { 
      success: false, 
      error: "Invalid request origin" 
    };
  }
  
  try {
    const redirectUrl = await account.createOAuth2Token(
      provider,
      `${origin}/api/auth/oauth`,
      `${origin}/login`
    );
    
    return { 
      success: true, 
      redirectUrl 
    };
  } catch (error: unknown) {
    console.error(`${provider} login failed:`, error);
    return { 
      success: false, 
      error: `${provider} login failed. Please try again.` 
    };
  }
}

/**
 * Initiates Google OAuth login flow
 * 
 * @returns {Promise<AuthResult|string>} Authentication response with redirect URL or redirect URL string
 */
export async function loginWithGoogle(): Promise<AuthResult | string> {
  const response = await createOAuthSession(OAuthProvider.Google);
  return response.redirectUrl || response;
}

/**
 * Initiates GitHub OAuth login flow
 * 
 * @returns {Promise<AuthResult|string>} Authentication response with redirect URL or redirect URL string
 */
export async function loginWithGithub(): Promise<AuthResult | string> {
  const response = await createOAuthSession(OAuthProvider.Github);
  return response.redirectUrl || response;
}

/**
 * Verifies if the current user session is valid
 * 
 * @returns {Promise<boolean>} True if session is valid, false otherwise
 */
export async function verifySession(): Promise<boolean> {
  try {
    const { account } = await createAdminClient();
    await account.get();
    return true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
}