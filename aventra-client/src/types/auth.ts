export enum AuthMode {
    SIGN_IN = "SIGN_IN",
    SIGN_UP = "SIGN_UP"
  }
  
  export enum SocialProvider {
    GOOGLE = "Google",
    GITHUB = "GitHub"
  }
  
  export enum FormStatus {
    IDLE = "IDLE",
    LOADING = "LOADING",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR"
  }
  
  export interface AuthResult {
    success?: boolean;
    error?: string;
    redirectUrl?: string;
  }