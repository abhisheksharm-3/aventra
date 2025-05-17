"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Eye, EyeClosed } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { AuthMode, SocialProvider, FormStatus } from "@/types/auth";
import {
  loginSchema,
  signupSchema,
  LoginFormValues,
  SignupFormValues,
} from "@/components/forms/schemas/auth";
import {
  Icons,
  PasswordStrengthIndicator,
  StatusMessage,
} from "@/components/forms/login-form-components";
import { useUserStore } from "@/stores/userStore";

/**
 * LoginForm component that handles both sign-in and sign-up flows
 * Includes email/password authentication and social provider options
 */
export default function LoginForm() {
  // State management with enums for better type safety
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.SIGN_IN);
  const [status, setStatus] = useState<FormStatus>(FormStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const { login, register, loginWithGoogle, loginWithGithub } = useUserStore();

  // Get return URL from query params
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";

  // Initialize login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Initialize signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Derived state
  const isLoading = status === FormStatus.LOADING;
  const isSignUp = authMode === AuthMode.SIGN_UP;

  /**
   * Switches between login and signup modes
   */
  const switchAuthMode = useCallback((mode: AuthMode) => {
    if (!isLoading) {
      setAuthMode(mode);
      setError(null);
      setSuccess(null);
    }
  }, [isLoading]);

  /**
   * Handles login form submission
   */
  const onLoginSubmit = useCallback(async (data: LoginFormValues) => {
    setStatus(FormStatus.LOADING);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await login(formData);

      if (!result.success) {
        setError(result.error || "Login failed. Please try again.");
        setStatus(FormStatus.ERROR);
      } else {
        setSuccess("Login successful! Redirecting you now...");
        setStatus(FormStatus.SUCCESS);
        // Delay redirect slightly to show success message
        setTimeout(() => {
          router.push(returnUrl);
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setStatus(FormStatus.ERROR);
    }
  }, [login, router, returnUrl]);

  /**
   * Handles signup form submission
   */
  const onSignupSubmit = useCallback(async (data: SignupFormValues) => {
    setStatus(FormStatus.LOADING);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await register(formData);

      if (!result.success) {
        setError(result.error || "Signup failed. Please try again.");
        setStatus(FormStatus.ERROR);
      } else {
        setSuccess("Account created successfully! Redirecting you now...");
        setStatus(FormStatus.SUCCESS);
        // Delay redirect slightly to show success message
        setTimeout(() => {
          router.push(returnUrl);
        }, 1500);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again.");
      setStatus(FormStatus.ERROR);
    }
  }, [register, router, returnUrl]);

  /**
   * Handles social authentication
   */
  const handleSocialLogin = useCallback(async (provider: SocialProvider) => {
    setStatus(FormStatus.LOADING);
    setError(null);

    try {
      let response;

      if (provider === SocialProvider.GOOGLE) {
        response = await loginWithGoogle();
      } else if (provider === SocialProvider.GITHUB) {
        response = await loginWithGithub();
      }

      // Check if the response is a string (redirect URL) or an object with redirectUrl
      if (typeof response === "string") {
        window.location.href = response; // Perform redirect
      } else if (response && response.redirectUrl) {
        window.location.href = response.redirectUrl; // Perform redirect
      } else if (response && !response.success) {
        setError(
          response.error || `${provider} login failed. Please try again.`
        );
        setStatus(FormStatus.ERROR);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      setError(`Failed to authenticate with ${provider}. Please try again.`);
      setStatus(FormStatus.ERROR);
    }
  }, [loginWithGoogle, loginWithGithub]);

  /**
   * Toggles between showing and hiding password
   */
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <div className="w-full">
      {/* Auth mode toggle */}
      <div className="flex p-1 mb-8 bg-accent/30 rounded-lg w-full border border-border/50 shadow-sm">
        <button
          type="button"
          onClick={() => switchAuthMode(AuthMode.SIGN_IN)}
          className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
            !isSignUp
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground/80"
          }`}
          disabled={isLoading}
          aria-pressed={!isSignUp}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => switchAuthMode(AuthMode.SIGN_UP)}
          className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
            isSignUp
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground/80"
          }`}
          disabled={isLoading}
          aria-pressed={isSignUp}
        >
          Create Account
        </button>
      </div>

      {/* Status messages with animations */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <StatusMessage type="error" message={error} />
          </motion.div>
        )}

        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <StatusMessage type="success" message={success} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth form with animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSignUp ? "signup" : "login"}
          initial={{ opacity: 0, x: isSignUp ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isSignUp ? 20 : -20 }}
          transition={{ duration: 0.3 }}
        >
          {isSignUp ? (
            <Form {...signupForm}>
              <form
                onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                className="space-y-5"
                aria-label="Sign up form"
              >
                <FormField
                  control={signupForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {Icons.User}
                          </span>
                          <Input
                            {...field}
                            placeholder="Username"
                            className="pl-10 h-12 border-border/50 bg-accent/30"
                            aria-label="Username"
                            autoComplete="username"
                            data-testid="username-input"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {Icons.Email}
                          </span>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Email address"
                            className="pl-10 h-12 border-border/50 bg-accent/30"
                            aria-label="Email address"
                            autoComplete="email"
                            data-testid="email-input"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {Icons.Password}
                          </span>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pl-10 pr-10 h-12 border-border/50 bg-accent/30"
                            aria-label="Password"
                            autoComplete="new-password"
                            data-testid="password-input"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <PasswordStrengthIndicator
                  password={signupForm.watch("password")}
                />

                <Button
                  type="submit"
                  className="w-full h-12 rounded-lg text-base font-medium mt-6 bg-primary hover:bg-primary/90 cursor-pointer"
                  disabled={isLoading}
                  data-testid="signup-button"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      {Icons.Spinner}
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-5"
                aria-label="Sign in form"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {Icons.Email}
                          </span>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Email address"
                            className="pl-10 h-12 border-border/50 bg-accent/30"
                            aria-label="Email address"
                            autoComplete="email"
                            data-testid="email-input"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {Icons.Password}
                          </span>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pl-10 pr-10 h-12 border-border/50 bg-accent/30"
                            aria-label="Password"
                            autoComplete="current-password"
                            data-testid="password-input"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={togglePasswordVisibility}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end items-center text-sm mt-6">
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-lg text-base font-medium mt-2 bg-primary hover:bg-primary/90 cursor-pointer"
                  disabled={isLoading}
                  data-testid="signin-button"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      {Icons.Spinner}
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Divider for social login options */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/40"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 text-muted-foreground bg-background">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social login buttons */}
      <div className="grid grid-cols-1 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 flex items-center justify-center gap-2 border-border/50 bg-accent/30 hover:bg-accent/50"
          onClick={() => handleSocialLogin(SocialProvider.GOOGLE)}
          disabled={isLoading}
          aria-label="Continue with Google"
          data-testid="google-login-button"
        >
          {Icons.Google}
          <span>Continue with Google</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-12 flex items-center justify-center gap-2 border-border/50 bg-accent/30 hover:bg-accent/50"
          onClick={() => handleSocialLogin(SocialProvider.GITHUB)}
          disabled={isLoading}
          aria-label="Continue with GitHub"
          data-testid="github-login-button"
        >
          {Icons.GitHub}
          <span>Continue with GitHub</span>
        </Button>
      </div>
    </div>
  );
}