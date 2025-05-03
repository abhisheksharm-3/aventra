export interface User {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    password?: string;
    hash?: string;
    hashOptions?: object;
    registration: string;
    status: boolean;
    labels: string[];
    passwordUpdate: string;
    email: string;
    phone?: string;
    emailVerification: boolean;
    phoneVerification: boolean;
    mfa: boolean;
    prefs: object;
    avatarUrl?: string;
    accessedAt: string;
}

export interface UserUpdateResult {
    success: boolean;
    error?: string;
  }

  export interface UserPreferences {
    theme?: 'light' | 'dark' | 'system';
    bio?: string;
    website?: string;
    location?: string;
    avatarUrl?: string;
    emailNotifications?: boolean;
    marketingEmails?: boolean;
    role?: string;
    [key: string]: string | boolean | number | undefined;
  }