import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./controllers/AuthController";
import { checkOnboardingStatus } from "./controllers/OnboardingController";
import { getCurrentUser } from "./controllers/UserController";

// ==========================================
// Configuration Constants
// ==========================================

/**
 * Routes that don't require authentication
 */
const PUBLIC_ROUTES = new Set([
  "/login",
  "/forgot-password",
  "/api/auth/oauth",
  "/",
  "/about",
  "/contact",
  "/pricing",
]);

/**
 * Routes that should redirect to dashboard if already authenticated
 */
const AUTH_ROUTES = new Set([
  "/login", 
  "/forgot-password",
  "/register",
  "/reset-password",
]);

/**
 * Routes exempt from onboarding checks
 */
const ONBOARDING_EXEMPT_ROUTES = new Set([
  "/onboarding",
  "/api/onboarding",
  "/api/auth/logout",
]);

/**
 * Public asset paths that bypass middleware entirely
 */
const PUBLIC_ASSET_PREFIXES = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico", 
  "/_vercel",
  "/images",
  "/fonts",
  "/videos",
  "/assets",
];

/**
 * Security headers for all responses
 */
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

// ==========================================
// Helper Functions
// ==========================================

/**
 * Checks if path should completely bypass middleware
 */
function shouldBypassMiddleware(path: string): boolean {
  // Check if it's a public asset
  if (PUBLIC_ASSET_PREFIXES.some(prefix => path.startsWith(prefix))) {
    return true;
  }
  
  return false;
}

/**
 * Determines if a path is a public route that doesn't require authentication
 */
function isPublicRoute(path: string): boolean {
  // Check for exact matches
  if (PUBLIC_ROUTES.has(path)) {
    return true;
  }
  
  // Check for API routes that are explicitly public
  // but might have additional path segments
  const pathSegments = path.split('/');
  if (pathSegments.length >= 3) {
    const baseApiPath = `/${pathSegments[1]}/${pathSegments[2]}`;
    if (PUBLIC_ROUTES.has(baseApiPath)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Checks if path is an authentication route (login, register, etc.)
 */
function isAuthRoute(path: string): boolean {
  return AUTH_ROUTES.has(path);
}

/**
 * Checks if path is exempt from onboarding redirect
 */
function isOnboardingExempt(path: string): boolean {
  if (ONBOARDING_EXEMPT_ROUTES.has(path)) {
    return true;
  }
  
  // Check API routes with longer paths
  return Array.from(ONBOARDING_EXEMPT_ROUTES)
    .filter((route: string) => route.startsWith("/api/"))
    .some((route: string) => path.startsWith(route));
}

/**
 * Adds security headers to a response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Creates a standardized log message
 */
function createLogMessage(message: string, path: string, userId?: string): string {
  const timestamp = new Date().toISOString();
  const userInfo = userId ? `[User: ${userId}]` : '[No User]';
  return `[${timestamp}] ${userInfo} [Path: ${path}] ${message}`;
}

/**
 * Conditional logging function that respects production environment
 */
function conditionalLog(
  isProduction: boolean, 
  message: string, 
  path: string, 
  userId?: string, 
  error?: unknown
): void {
  if (!isProduction) {
    if (error) {
      console.error(createLogMessage(message, path, userId), error);
    } else {
      console.log(createLogMessage(message, path, userId));
    }
  }
}

// ==========================================
// Main Middleware Function
// ==========================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Create base response and add security headers
  const response = addSecurityHeaders(NextResponse.next());
  
  // Skip middleware completely for assets and other excluded paths
  if (shouldBypassMiddleware(pathname)) {
    return response;
  }

  try {
    // Get session cookie
    const sessionCookie = request.cookies.get("user-session");
    let userId: string | undefined;
    let isAuthenticated = false;

    // 1. Authentication Check
    if (sessionCookie?.value) {
      try {
        isAuthenticated = await verifySession();
        
        if (isAuthenticated) {
          // Get user data if authenticated
          const userData = await getCurrentUser();
          userId = userData?.$id;
          
          // Add auth headers for client-side initialization
          if (userId) {
            response.headers.set('X-User-Authenticated', 'true');
            response.headers.set('X-User-Id', userId);
          }
        } else {
          // Invalid session - clear cookie
          response.cookies.delete("user-session");
        }
      } catch (authError) {
        // Authentication error - clear cookie
        conditionalLog(
          isProduction, 
          "Auth verification error", 
          pathname, 
          undefined, 
          authError
        );
        response.cookies.delete("user-session");
      }
    }
    
    // 2. Handle Authentication Routes
    if (isAuthenticated && isAuthRoute(pathname)) {
      conditionalLog(
        isProduction, 
        "Redirecting authenticated user from auth route", 
        pathname, 
        userId
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // 3. Onboarding Check for Authenticated Users
    if (isAuthenticated && !isOnboardingExempt(pathname)) {
      try {
        const hasCompletedOnboarding = await checkOnboardingStatus();
        
        if (!hasCompletedOnboarding) {
          conditionalLog(
            isProduction, 
            "Redirecting to onboarding", 
            pathname, 
            userId
          );
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
        
        // Redirect from onboarding if already completed
        if (pathname === "/onboarding") {
          conditionalLog(
            isProduction, 
            "Redirecting from completed onboarding", 
            pathname, 
            userId
          );
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (onboardingError) {
        conditionalLog(
          isProduction, 
          "Onboarding check error", 
          pathname, 
          userId, 
          onboardingError
        );
        // Continue and assume onboarding is completed on error
        // to avoid login loops
      }
    }
    
    // 4. Protected Route Access Check
    if (!isAuthenticated && !isPublicRoute(pathname)) {
      conditionalLog(
        isProduction, 
        "Redirecting unauthenticated user to login", 
        pathname
      );
      
      // Save the current URL for redirecting back after login
      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/") {
        loginUrl.searchParams.set("returnUrl", pathname);
      }
      
      return NextResponse.redirect(loginUrl);
    }
    
    // 5. Default - Allow Access
    return response;
    
  } catch (error) {
    // Global error handler
    conditionalLog(
      isProduction, 
      "Middleware uncaught error", 
      pathname, 
      undefined, 
      error
    );
    
    // In production, log minimal info
    if (isProduction) {
      console.error(`Middleware error on path: ${pathname}`);
    }
    
    // Clear session on critical errors
    response.cookies.delete("user-session");
    
    // Redirect to login if not on a public route
    if (!isPublicRoute(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    return response;
  }
}

/**
 * Define which paths the middleware should run on
 * This improves performance by skipping middleware when not needed
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. Well-known static files and assets
     * 2. /_next/ (internal Next.js paths)
     * 3. /_static/ (if using a custom static folder)
     * 4. /_vercel/ (Vercel system paths)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|assets/|fonts/|images/).*)",
  ],
};