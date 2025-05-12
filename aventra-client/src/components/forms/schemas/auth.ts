/**
 * Authentication Form Schemas
 * Centralized validation schemas for authentication forms using Zod
 */

import * as z from "zod"

/**
 * Email validation schema
 * Common email validation used across schemas
 */
const emailSchema = z.string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .trim()
  .toLowerCase();

/**
 * Password validation schema with strength requirements
 * Base password validation used across schemas
 */
const passwordSchema = z.string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password cannot exceed 100 characters");

/**
 * Strong password validation schema (for signup)
 * Enhanced password validation with strength requirements
 */
const strongPasswordSchema = passwordSchema
  .refine(
    password => /[A-Z]/.test(password),
    "Password should contain at least one uppercase letter"
  )
  .refine(
    password => /[0-9]/.test(password),
    "Password should contain at least one number"
  );

/**
 * Login form schema
 * Validates email and password for sign-in
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Signup form schema
 * Validates username, email, and password with strength requirements
 */
export const signupSchema = z.object({
  username: z.string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens")
    .transform(val => val.trim()),
  email: emailSchema,
  password: strongPasswordSchema,
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }).optional()
});

/**
 * Forgot password schema
 * Validates email for password reset
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema
});

/**
 * Reset password schema
 * Validates password and confirmation for password reset
 */
export const resetPasswordSchema = z.object({
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Export type definitions for forms
export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

/**
 * SessionData type for storing authentication session information
 */
export type SessionData = {
  userId: string;
  email: string;
  lastLogin: string;
  expiresAt: number;
}

// Data for form analytics
const FORM_METADATA = {
  lastUpdated: "2025-05-12 15:02:07",
  maintainer: "abhisheksharm-3",
  version: "1.3.0"
};

export default FORM_METADATA;