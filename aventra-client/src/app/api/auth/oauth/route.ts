import { createAdminClient } from "@/lib/services/appwrite/appwrite";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

/**
 * Authentication verification API route
 * Handles user verification and session creation via Appwrite
 * 
 * @param request The incoming request with userId and secret as query parameters
 * @returns A redirect response to the dashboard on success or an error response
 */
export async function GET(request: NextRequest) {
  // Get current time for logging
  const currentDateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  try {
    // Extract parameters from request URL
    const userId = request.nextUrl.searchParams.get("userId");
    const secret = request.nextUrl.searchParams.get("secret");
    
    // Parameter validation
    if (!userId || !secret) {
      console.error(`[${currentDateTime}] Auth verification failed: Missing parameters`);
      return NextResponse.json({ error: "Missing userId or secret" }, { status: 400 });
    }
    
    // Create Appwrite admin client and session
    const { account } = await createAdminClient();
    const session = await account.createSession(userId, secret);
    
    // Set secure HTTP-only cookie with session information
    const cookieStore = await cookies();
    cookieStore.set("user-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production', // Only set secure in production
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });
    
    // Add additional session info if needed
    cookieStore.set("user-last-login", currentDateTime, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
    });

    // Redirect to dashboard on successful authentication
    return NextResponse.redirect(`${request.nextUrl.origin}/dashboard`);
  } catch (error) {
    // Handle errors gracefully
    console.error(`[${currentDateTime}] Auth verification error:`, error);
    return NextResponse.json(
      { error: "Authentication failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 401 }
    );
  }
}