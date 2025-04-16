"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { login, signup } from "@/lib/actions/auth-actions"

import { 
  AuthMode, 
  SocialProvider, 
  FormStatus 
} from "@/types/auth"
import { 
  loginSchema, 
  signupSchema, 
  LoginFormValues, 
  SignupFormValues 
} from "@/components/forms/schemas/auth"
import {
  IconInput,
  RememberMeCheckbox,
  Icons,
  PasswordStrengthIndicator,
  StatusMessage,
  SocialButton
} from "@/components/forms/login-form-components"

export default function LoginForm() {
  // State management with enums for better type safety
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.SIGN_IN)
  const [status, setStatus] = useState<FormStatus>(FormStatus.IDLE)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get return URL from query params
  const returnUrl = searchParams.get('returnUrl') || '/dashboard'

  // Initialize login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  // Initialize signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      remember: false,
    },
  })

  // Login form submission handler
  const onLoginSubmit = async (data: LoginFormValues) => {
    setStatus(FormStatus.LOADING)
    setError(null)
    setSuccess(null)
    
    try {
      const result = await login(data)
      
      if (result.error) {
        setError(result.error)
        setStatus(FormStatus.ERROR)
      } else {
        setSuccess("Login successful! Redirecting you now...")
        setStatus(FormStatus.SUCCESS)
        // Delay redirect slightly to show success message
        setTimeout(() => {
          router.push(returnUrl)
        }, 1500)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An unexpected error occurred. Please try again.")
      setStatus(FormStatus.ERROR)
    }
  }

  // Signup form submission handler
  const onSignupSubmit = async (data: SignupFormValues) => {
    setStatus(FormStatus.LOADING)
    setError(null)
    setSuccess(null)
    
    try {
      const result = await signup(data)
      
      if (result.error) {
        setError(result.error)
        setStatus(FormStatus.ERROR)
      } else {
        setSuccess("Account created successfully! Redirecting you now...")
        setStatus(FormStatus.SUCCESS)
        // Delay redirect slightly to show success message
        setTimeout(() => {
          router.push(returnUrl)
        }, 1500)
      }
    } catch (error) {
      console.error("Signup error:", error)
      setError("An unexpected error occurred. Please try again.")
      setStatus(FormStatus.ERROR)
    }
  }

  // Social login handler
  const handleSocialLogin = (provider: SocialProvider) => {
    console.log(`Login with ${provider}`)
    setStatus(FormStatus.LOADING)
    // Simulate social login (replace with actual implementation)
    setTimeout(() => {
      setStatus(FormStatus.SUCCESS)
      setSuccess(`${provider} authentication successful! Redirecting...`)
      setTimeout(() => router.push(returnUrl), 1500)
    }, 1000)
  }

  const isLoading = status === FormStatus.LOADING;
  const isSignUp = authMode === AuthMode.SIGN_UP;

  return (
    <div className="w-full">
      {/* Auth mode toggle */}
      <div className="flex p-1 mb-8 bg-accent/30 rounded-lg w-full border border-border/50 shadow-sm">
        <button
          onClick={() => !isLoading && setAuthMode(AuthMode.SIGN_IN)}
          className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
            !isSignUp
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground/80"
          }`}
          disabled={isLoading}
        >
          Sign In
        </button>
        <button
          onClick={() => !isLoading && setAuthMode(AuthMode.SIGN_UP)}
          className={`flex-1 py-2.5 px-4 rounded-md font-medium text-sm transition-all ${
            isSignUp
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground/80"
          }`}
          disabled={isLoading}
        >
          Create Account
        </button>
      </div>

      {/* Status messages */}
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

      {/* Form */}
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
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-5">
                <FormField
                  control={signupForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <IconInput 
                        field={field} 
                        placeholder="Username" 
                        icon={Icons.User} 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <IconInput 
                        field={field} 
                        type="email" 
                        placeholder="Email address" 
                        icon={Icons.Email} 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <IconInput 
                        field={field} 
                        placeholder="Password" 
                        icon={Icons.Password} 
                        showPasswordToggle 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <PasswordStrengthIndicator password={signupForm.watch("password")} />

                <div className="flex justify-between items-center text-sm mt-6">
                  <RememberMeCheckbox control={signupForm.control} name="remember" formId="signup" />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-lg text-base font-medium mt-2 bg-primary hover:bg-primary/90 cursor-pointer"
                  disabled={isLoading}
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
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <IconInput 
                        field={field} 
                        type="email" 
                        placeholder="Email address" 
                        icon={Icons.Email} 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <IconInput 
                        field={field} 
                        placeholder="Password" 
                        icon={Icons.Password} 
                        showPasswordToggle 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center text-sm mt-6">
                  <RememberMeCheckbox control={loginForm.control} name="remember" formId="login" />
                  
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

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/40"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 text-muted-foreground bg-background">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <SocialButton 
          provider={SocialProvider.GOOGLE}
          icon={Icons.Google}
          onClick={() => handleSocialLogin(SocialProvider.GOOGLE)}
          disabled={isLoading}
        />

        <SocialButton 
          provider={SocialProvider.GITHUB}
          icon={Icons.GitHub}
          onClick={() => handleSocialLogin(SocialProvider.GITHUB)}
          disabled={isLoading}
        />
      </div>
    </div>
  )
}