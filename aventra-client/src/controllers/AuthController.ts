"use server";

import { ID, OAuthProvider } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/services/appwrite/appwrite";
import { AuthResult } from "@/types/auth";
import { headers } from "next/headers";
import { loginSchema, signupSchema } from "@/components/forms/schemas/auth";

/**
 * Sets a cookie via the API route.
 *
 * @param {string} cookieName - The name of the cookie.
 * @param {string} value - The value to set for the cookie.
 * @param {number} maxAge - Maximum age of the cookie in seconds.
 * @throws Will throw an error if the cookie cannot be set.
 */
async function setCookieViaApi(cookieName: string, value: string, maxAge: number): Promise<void> {
  const userHeaders = await headers();
  const origin = userHeaders.get("origin");
  if (!origin) throw new Error("Invalid request origin");

  const response = await fetch(`${origin}/api/auth/cookies`, {
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
    console.error("Failed to set cookie:", await response.text());
    throw new Error("Failed to set the session cookie.");
  }
}

/**
 * Clears the user session cookie via API.
 *
 * @throws Will throw an error if the cookie cannot be cleared.
 */
async function clearCookie(): Promise<void> {
  const userHeaders = await headers();
  const origin = userHeaders.get("origin");
  if (!origin) throw new Error("Invalid request origin");

  const response = await fetch(`${origin}/api/auth/cookies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "clear",
      cookieName: "user-session",
    }),
  });

  if (!response.ok) {
    console.error("Failed to clear cookie:", await response.text());
    throw new Error("Failed to clear the session cookie.");
  }
}

/**
 * Signs up a user with email, username, and password.
 *
 * @param {FormData} formData - Form data containing username, email, and password.
 * @returns {Promise<AuthResult>} The result of the signup operation.
 */
export async function signUpWithEmail(formData: FormData): Promise<AuthResult> {
  try {
    const validationData = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = signupSchema.safeParse(validationData);
    if (!result.success) return { success: false, error: result.error.errors[0]?.message || "Invalid input data" };

    const { username, email, password } = validationData;
    const { account } = await createAdminClient();

    await account.create(ID.unique(), email, password, username);
    const session = await account.createEmailPasswordSession(email, password);

    await setCookieViaApi("user-session", session.secret, 60 * 60 * 24 * 7); // 7 days
    return { success: true };
  } catch (error: unknown) {
    console.error("Sign up failed:", error);
    const errorMessage = error instanceof Error && error.message.includes("already exists")
      ? "An account with this email already exists."
      : "Sign up failed. Please try again.";
    return { success: false, error: errorMessage };
  }
}

/**
 * Logs in a user with email and password.
 *
 * @param {FormData} formData - Form data containing email and password.
 * @returns {Promise<AuthResult>} The result of the login operation.
 */
export async function loginWithEmail(formData: FormData): Promise<AuthResult> {
  try {
    const validationData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = loginSchema.safeParse(validationData);
    if (!result.success) return { success: false, error: result.error.errors[0]?.message || "Invalid input data" };

    const { email, password } = validationData;
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);
    await setCookieViaApi("user-session", session.secret, 60 * 60 * 24 * 7); // 7 days
    return { success: true };
  } catch (error: unknown) {
    console.error("Login failed:", error);
    return { success: false, error: "Invalid email or password. Please try again." };
  }
}

/**
 * Logs out the current user by deleting their session.
 *
 * @returns {Promise<AuthResult>} The result of the logout operation.
 */
export async function logout(): Promise<AuthResult> {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession("current");
    await clearCookie();
    return { success: true };
  } catch (error: unknown) {
    console.error("Logout failed:", error);
    return { success: false, error: "Logout failed. Please try again." };
  }
}

/**
 * Creates an OAuth session for a given provider.
 *
 * @param {OAuthProvider} provider - The OAuth provider (e.g., Google, GitHub).
 * @returns {Promise<AuthResult>} The result of the OAuth session creation.
 */
async function createOAuthSession(provider: OAuthProvider): Promise<AuthResult> {
  try {
    const { account } = await createAdminClient();
    const userHeaders = await headers();
    const origin = userHeaders.get("origin");
    if (!origin) throw new Error("Invalid request origin");

    const redirectUrl = await account.createOAuth2Token(provider, `${origin}/api/auth/oauth`, `${origin}/login`);
    return { success: true, redirectUrl };
  } catch (error: unknown) {
    console.error(`${provider} login failed:`, error);
    return { success: false, error: `${provider} login failed. Please try again.` };
  }
}

/**
 * Initiates Google OAuth login flow.
 *
 * @returns {Promise<AuthResult | string>} The redirect URL or error response.
 */
export async function loginWithGoogle(): Promise<AuthResult | string> {
  const response = await createOAuthSession(OAuthProvider.Google);
  return response.redirectUrl || response;
}

/**
 * Initiates GitHub OAuth login flow.
 *
 * @returns {Promise<AuthResult | string>} The redirect URL or error response.
 */
export async function loginWithGithub(): Promise<AuthResult | string> {
  const response = await createOAuthSession(OAuthProvider.Github);
  return response.redirectUrl || response;
}

/**
 * Verifies if the current user session is valid.
 *
 * @returns {Promise<boolean>} True if the session is valid, false otherwise.
 */
export async function verifySession(): Promise<boolean> {
  try {
    const { account } = await createSessionClient();
    await account.get();
    return true;
  } catch {
    return false;
  }
}