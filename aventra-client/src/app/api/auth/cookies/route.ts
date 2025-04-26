import { NextResponse } from "next/server";

/**
 * Handles setting, clearing, or updating cookies.
 *
 * Request body should include:
 * - action: "set" | "clear" - Action to perform on the cookie.
 * - cookieName: Name of the cookie (e.g., "user-session").
 * - value: Value of the cookie (required for "set").
 * - options: Cookie options (optional, e.g., path, maxAge).
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { action, cookieName, value, options } = body;

    if (!action || !cookieName) {
      return NextResponse.json(
        { error: "Missing required fields: 'action' or 'cookieName'" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    switch (action) {
      case "set":
        if (!value) {
          return NextResponse.json(
            { error: "Value is required for setting a cookie." },
            { status: 400 }
          );
        }

        // Set the cookie
        response.cookies.set(cookieName, value, {
          path: options?.path || "/",
          httpOnly: options?.httpOnly !== false,
          secure: options?.secure ?? process.env.NODE_ENV === "production",
          sameSite: options?.sameSite || "Strict",
          maxAge: options?.maxAge || 60 * 60 * 24 * 7, // Default: 7 days
        });
        return response;

      case "clear":
        // Clear the cookie
        response.cookies.set(cookieName, "", {
          path: options?.path || "/",
          httpOnly: options?.httpOnly !== false,
          secure: options?.secure ?? process.env.NODE_ENV === "production",
          sameSite: options?.sameSite || "Strict",
          maxAge: 0, // Clear by setting Max-Age to 0
        });
        return response;

      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'set' or 'clear'." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in cookie handler:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}