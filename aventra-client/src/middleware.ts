import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./controllers/AuthController";
import { checkOnboardingStatus } from "./controllers/OnboardingController";

// Define routes that don't require authentication
const publicRoutes = [
  "/login",
  "/forgot-password",
  "/api/auth/oauth",
  "/"
];

// Define routes that should never be accessible if already authenticated
const authRoutes = ["/login", "/forgot-password"];

// Routes that are exempt from onboarding check
const onboardingExemptRoutes = [
  "/onboarding",
  "/api/onboarding",
];

// Add paths for public static assets
const publicAssetPaths = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico", 
  "/_vercel",
  "/images",
  "/fonts",
  "/videos",
];

/**
 * Check if a path is a public asset that should bypass authentication
 */
function isPublicAsset(path: string): boolean {
  return publicAssetPaths.some(assetPath => path.startsWith(assetPath));
}

/**
 * Fixed function to check if a path is a public route
 * Uses exact matching for root path to avoid bypassing all routes
 */
function isPublicRoute(path: string): boolean {
  // Special handling for root path
  if (path === "/" && publicRoutes.includes("/")) {
    return true;
  }
  
  // For all other paths, use the normal matching logic
  return publicRoutes.some(route => {
    // Skip root path to avoid matching everything
    if (route === "/") return false;
    
    return path === route || path.startsWith(`${route}/`);
  });
}

function isAuthRoute(path: string): boolean {
  return authRoutes.some(route => path === route || path.startsWith(`${route}/`));
}

function isOnboardingExempt(path: string): boolean {
  return onboardingExemptRoutes.some(route => path === route || path.startsWith(`${route}/`));
}

function isApiRoute(path: string): boolean {
  return path.startsWith("/api/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public assets to bypass middleware completely
  if (isPublicAsset(pathname)) {
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
        
        // Check onboarding status for authenticated users
        if (!isOnboardingExempt(pathname)) {
          const hasCompletedOnboarding = await checkOnboardingStatus();
          
          if (!hasCompletedOnboarding) {
            // Redirect to onboarding if not completed
            return NextResponse.redirect(new URL("/onboarding", request.url));
          }
          
          // If user is trying to access onboarding but has already completed it
          if (pathname === "/onboarding") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        }
        
        // For all other routes, proceed as normal (user is authenticated)
        return response;
      } else {
        // Session exists but is invalid, clear it
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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|assets|fonts|videos).*)",
  ],
};