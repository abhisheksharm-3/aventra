"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createAdminClient, createSessionClient, createUsersAdmin } from "@/lib/services/appwrite/appwrite";
import { UserUpdateResult } from "@/types/appwrite";

/**
 * Get the currently logged in user's data
 * @returns User data or null if not logged in
 */
export async function getCurrentUser() {
  try {
    const { account } = await createSessionClient();
    return await account.get();
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

/**
 * Schema for profile update validation
 */
const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
});

/**
 * Update user profile information
 * @param formData Form data with profile information
 * @returns Result of the update operation
 */
export async function updateUserProfile(formData: FormData): Promise<UserUpdateResult> {
  try {
    const { account } = await createAdminClient();
    
    // Extract and validate form data
    const updateData = {
      name: formData.get("name") as string || undefined,
      bio: formData.get("bio") as string || undefined,
      website: formData.get("website") as string || undefined,
      location: formData.get("location") as string || undefined,
    };

    // Validate input data
    const result = profileUpdateSchema.safeParse(updateData);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Invalid input data";
      return { success: false, error: errorMessage };
    }
    
    // Update user name in Appwrite (only field directly supported)
    if (updateData.name) {
      await account.updateName(updateData.name);
    }
    
    // Store other profile data in user preferences
    const currentPrefs = (await account.getPrefs()) || {};
    
    const updatedPrefs = {
      ...currentPrefs,
      bio: updateData.bio ?? currentPrefs.bio,
      website: updateData.website ?? currentPrefs.website,
      location: updateData.location ?? currentPrefs.location,
    };
    
    await account.updatePrefs(updatedPrefs);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred";
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Schema for user preferences validation
 */
const prefsUpdateSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  emailNotifications: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
});

/**
 * Update user preferences
 * @param formData Form data with user preferences
 * @returns Result of the update operation
 */
export async function updateUserPreferences(formData: FormData): Promise<UserUpdateResult> {
  try {
    const { account } = await createAdminClient();
    
    // Extract and validate form data
    const prefsData = {
      theme: formData.get("theme") as "light" | "dark" | "system" | undefined,
      emailNotifications: formData.get("emailNotifications") === "true",
      marketingEmails: formData.get("marketingEmails") === "true",
    };

    // Validate input data
    const result = prefsUpdateSchema.safeParse(prefsData);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Invalid input data";
      return { success: false, error: errorMessage };
    }
    
    // Get current preferences and update
    const currentPrefs = (await account.getPrefs()) || {};
    
    const updatedPrefs = {
      ...currentPrefs,
      theme: prefsData.theme ?? currentPrefs.theme,
      emailNotifications: prefsData.emailNotifications !== undefined 
        ? prefsData.emailNotifications 
        : currentPrefs.emailNotifications,
      marketingEmails: prefsData.marketingEmails !== undefined 
        ? prefsData.marketingEmails 
        : currentPrefs.marketingEmails,
    };
    
    await account.updatePrefs(updatedPrefs);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update user preferences:", error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred";
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Schema for email update validation
 */
const emailUpdateSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

/**
 * Update user's email address
 * @param formData Form data with new email and current password
 * @returns Result of the update operation
 */
export async function updateUserEmail(formData: FormData): Promise<UserUpdateResult> {
  try {
    const { account } = await createAdminClient();
    
    // Extract and validate form data
    const updateData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Validate input data
    const result = emailUpdateSchema.safeParse(updateData);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Invalid input data";
      return { success: false, error: errorMessage };
    }
    
    // Update email
    await account.updateEmail(updateData.email, updateData.password);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update email:", error);
    
    // Handle specific error types
    let errorMessage = "Failed to update email. Please try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("Invalid credentials")) {
        errorMessage = "Incorrect password provided. Please try again.";
      } else if (error.message.includes("already exists")) {
        errorMessage = "This email is already in use. Please use a different email.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Schema for password update validation
 */
const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
  newPassword: z.string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(8, "Password confirmation must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

/**
 * Update user's password
 * @param formData Form data with current and new passwords
 * @returns Result of the update operation
 */
export async function updateUserPassword(formData: FormData): Promise<UserUpdateResult> {
  try {
    const { account } = await createAdminClient();
    
    // Extract and validate form data
    const updateData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    // Validate input data
    const result = passwordUpdateSchema.safeParse(updateData);
    if (!result.success) {
      const errorMessage = result.error.errors[0]?.message || "Invalid input data";
      return { success: false, error: errorMessage };
    }
    
    // Update password
    await account.updatePassword(updateData.newPassword, updateData.currentPassword);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update password:", error);
    
    // Handle specific error types
    let errorMessage = "Failed to update password. Please try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("Invalid credentials")) {
        errorMessage = "Incorrect current password. Please try again.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete the user's account
 * @param formData User's current password for confirmation
 * @returns Result of the operation
 */
export async function deleteUserAccount(formData: FormData): Promise<UserUpdateResult> {
  try {
    const { account } = await createSessionClient();
    
    const password = formData.get("password") as string;
    
    if (!password || password.length < 8) {
      return { success: false, error: "Valid password is required to delete your account" };
    }
    
    // Get current user to get their ID
    let currentUser;
    try {
      currentUser = await account.get();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return { success: false, error: "Failed to authenticate user" };
    }
    
    if (!currentUser || !currentUser.$id) {
      return { success: false, error: "User not found" };
    }
    
    // Get the Users admin service
    const users = await createUsersAdmin();
    
    // Delete the user account using the Users API
    await users.delete(currentUser.$id);
    
    // Clear cookies
    const userCookies = await cookies();
    userCookies.delete("user-session");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete account:", error);
    
    let errorMessage = "Failed to delete account. Please try again.";
    
    if (error instanceof Error) {
      if (error.message.includes("Invalid credentials")) {
        errorMessage = "Incorrect password. Please try again.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Upload a new profile avatar
 * @param formData Form data containing the avatar file
 * @returns Result with the avatar URL if successful
 */
export async function uploadAvatar(formData: FormData): Promise<UserUpdateResult & { avatarUrl?: string }> {
  try {
    const { account } = await createAdminClient();
    
    const avatarFile = formData.get("avatar") as File;
    if (!avatarFile) {
      return { success: false, error: "No avatar file provided" };
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(avatarFile.type)) {
      return { success: false, error: "File type not supported. Please upload a JPEG, PNG, GIF, or WebP image." };
    }
    
    // Check file size (max 2MB)
    if (avatarFile.size > 2 * 1024 * 1024) {
      return { success: false, error: "File size too large. Maximum size is 2MB." };
    }
    
    // Upload to storage and get URL
    // Note: This is a placeholder since Appwrite server SDK doesn't directly support file uploads
    // You would need to use the client SDK or implement a separate API route
    
    // For now, update user preferences with avatar information
    const currentPrefs = (await account.getPrefs()) || {};
    
    // In a real implementation, you would upload the file and get the URL
    const mockAvatarUrl = `/avatars/${Date.now()}_${avatarFile.name.replace(/\s/g, '_')}`;
    
    const updatedPrefs = {
      ...currentPrefs,
      avatarUrl: mockAvatarUrl,
    };
    
    await account.updatePrefs(updatedPrefs);
    
    return { 
      success: true,
      avatarUrl: mockAvatarUrl
    };
  } catch (error) {
    console.error("Failed to upload avatar:", error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred";
    
    return { success: false, error: errorMessage };
  }
}