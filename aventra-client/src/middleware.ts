import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./controllers/AuthController";
import { checkOnboardingStatus } from "./controllers/OnboardingController";
import { getCurrentUser } from "./controllers/UserController";

// Define routes that don't require authentication
const publicRoutes = [
  "/login",
  "/forgot-password",
  "/api/auth/oauth",
  "/",
  "/about",
  "/contact",
  "/pricing",
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
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  console.log(`[${timestamp}] Middleware check for: ${pathname}`);

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
          console.log(`[${timestamp}] User is authenticated, redirecting from auth route to dashboard`);
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        
        // Check onboarding status for authenticated users
        if (!isOnboardingExempt(pathname)) {
          const hasCompletedOnboarding = await checkOnboardingStatus();
          
          if (!hasCompletedOnboarding) {
            console.log(`[${timestamp}] User has not completed onboarding, redirecting to onboarding`);
            // Redirect to onboarding if not completed
            return NextResponse.redirect(new URL("/onboarding", request.url));
          }
          
          // If user is trying to access onboarding but has already completed it
          if (pathname === "/onboarding") {
            console.log(`[${timestamp}] User already completed onboarding, redirecting to dashboard`);
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        }
        
        // For all other routes, proceed as normal (user is authenticated)
        // Set an HTTP header with the user's authentication status
        // This can be used by client-side code to initialize the store
        const userData = await getCurrentUser();
        if (userData) {
          const userId = userData.$id || '';
          
          // Add headers for client-side initialization
          response.headers.set('X-User-Authenticated', 'true');
          response.headers.set('X-User-Id', userId);
          console.log(`[${timestamp}] Setting auth headers for user ${userId}`);
        }
        
        return response;
      } else {
        // Session exists but is invalid, clear it
        console.log(`[${timestamp}] Invalid session, clearing cookie`);
        response.cookies.delete("user-session");
      }
    }

    // If no valid session, handle based on the route type
    if (isPublicRoute(pathname)) {
      // Allow access to public routes
      console.log(`[${timestamp}] Access to public route allowed: ${pathname}`);
      return response;
    } else {
      // Redirect to login for protected routes
      console.log(`[${timestamp}] No valid session, redirecting to login`);
      const url = new URL("/login", request.url);
      if (pathname !== "/") {
        url.searchParams.set("returnUrl", pathname);
      }
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error(`[${timestamp}] Middleware authentication error:`, error);

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