import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./controllers/AuthController";

// Define routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/forgot-password",
  "/api/auth/oauth/google",
  "/api/auth/oauth/github",
  "/api/auth/callback", // Add callback route for OAuth flows
];

// Define routes that should never be accessible if already authenticated
const authRoutes = ["/login", "/forgot-password"];

/**
 * Check if a route is public (doesn't require authentication)
 * @param path - The current path
 * @returns boolean indicating if the route is public
 */
function isPublicRoute(path: string): boolean {
  return publicRoutes.some(route => path === route || path.startsWith(`${route}/`));
}

/**
 * Check if a route is an authentication route (login/signup pages)
 * @param path - The current path
 * @returns boolean indicating if the route is an auth route
 */
function isAuthRoute(path: string): boolean {
  return authRoutes.some(route => path === route || path.startsWith(`${route}/`));
}

/**
 * Check if a route is an API route
 * @param path - The current path
 * @returns boolean indicating if the route is an API route
 */
function isApiRoute(path: string): boolean {
  return path.startsWith("/api/");
}

/**
 * Middleware function that runs before requests are completed
 * Handles authentication checks and redirects
 * @param request - The incoming request
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static assets and image optimization requests to bypass middleware
  if (
    pathname.startsWith("/_next/static") || 
    pathname.startsWith("/_next/image") || 
    pathname.includes("/favicon.ico") || 
    pathname.includes("/_vercel")
  ) {
    return NextResponse.next();
  }

  // Allow non-auth-related API routes to bypass middleware
  if (isApiRoute(pathname) && !pathname.includes("/api/auth/")) {
    return NextResponse.next();
  }

  // Get the user session cookie
  const sessionCookie = request.cookies.get("user-session");
  const response = NextResponse.next();

  try {
    // Check if there's a session cookie and verify it
    if (sessionCookie?.value) {
      const isValidSession = await verifySession();

      if (isValidSession) {
        // If the user is already authenticated and on an auth route, redirect to dashboard
        if (isAuthRoute(pathname)) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        
        // For all other routes, proceed as normal (user is authenticated)
        return response;
      } else {
        // Session exists but is invalid, clear it and redirect to login
        response.cookies.delete("user-session");
      }
    }

    // If no valid session, handle based on the route type
    if (isPublicRoute(pathname)) {
      // Allow access to public routes
      return response;
    } else {
      // Redirect to login for protected routes
      const url = new URL("/login", request.url);
      if (pathname !== "/") {
        url.searchParams.set("returnUrl", pathname);
      }
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error("Middleware authentication error:", error);

    // In case of any error, clear the session cookie
    response.cookies.delete("user-session");

    // If not already on a public route, redirect to login
    if (!isPublicRoute(pathname)) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }

    // Return the response for public routes even if there's an error
    return response;
  }
}

/**
 * Configure which paths the middleware should run on
 * This runs middleware on all routes except specific static assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};