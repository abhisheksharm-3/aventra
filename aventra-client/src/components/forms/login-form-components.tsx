/**
 * Form Components Library
 * Collection of reusable form UI components with built-in React Hook Form integration
 */

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { useState, memo } from "react"
import { ControllerRenderProps, Control, FieldPath, FieldValues } from "react-hook-form"
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

/**
 * IconInput component
 * Renders an input field with an icon and optional password toggle
 */
export const IconInput = memo(<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ 
  field, 
  type = "text", 
  placeholder, 
  icon,
  showPasswordToggle = false 
}: IconInputProps<TFieldValues, TName>) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;
  
  return (
    <div className="group" data-testid={`input-group-${field.name}`}>
      <div className="relative rounded-lg overflow-hidden bg-accent/20 backdrop-blur-sm border border-border/40 hover:border-primary/20 transition-colors">
        <div className="absolute left-4 top-0 bottom-0 flex items-center text-muted-foreground">
          {icon}
        </div>
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            type={inputType}
            className="h-14 border-0 bg-transparent pl-12 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label={placeholder}
          />
        </FormControl>
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  )
});

IconInput.displayName = "IconInput";

/**
 * Remember Me Checkbox component
 * Renders a checkbox for "Remember me" functionality in login forms
 */
export const RememberMeCheckbox = memo(<TFieldValues extends FieldValues>({ 
  control, 
  name, 
  formId 
}: RememberMeCheckboxProps<TFieldValues>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex items-center space-x-2 space-y-0">
        <FormControl>
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
            id={`remember-${formId}`}
            className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            aria-label="Remember me"
          />
        </FormControl>
        <label
          htmlFor={`remember-${formId}`}
          className="text-muted-foreground cursor-pointer text-sm font-normal"
        >
          Remember me
        </label>
      </FormItem>
    )}
  />
));

RememberMeCheckbox.displayName = "RememberMeCheckbox";

/**
 * Collection of SVG icons used throughout the form components
 */
export const Icons = {
  Email: <Mail size={20} />,
  Password: <Lock size={20} />,
  User: <User size={20} />,
  Google: (
    <svg width="20" height="20" viewBox="0 0 24 24" className="text-red-500" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  GitHub: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
    </svg>
  ),
  Spinner: <Loader2 className="animate-spin h-4 w-4" />,
  Error: <AlertCircle size={20} />,
  Success: <CheckCircle2 size={20} />
}

/**
 * PasswordStrengthIndicator component
 * Visual indicator of password strength based on length and complexity
 */
export const PasswordStrengthIndicator = memo(({ password }: PasswordStrengthIndicatorProps) => {
  const getStrengthInfo = (password: string) => {
    // No password
    if (!password || password.length === 0) {
      return { 
        segments: [false, false, false, false], 
        text: "Password strength indicator", 
        color: null,
        strength: 0 
      };
    }
    
    // Calculate strength based on length, symbols, numbers, and case
    let strength = 0;
    
    // Basic length check
    if (password.length >= 5) strength += 1;
    if (password.length >= 8) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Check for diverse character types (bonus points)
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    
    // Count character diversity
    let diversityScore = 0;
    if (hasNumbers) diversityScore++;
    if (hasSymbols) diversityScore++;
    if (hasUppercase && hasLowercase) diversityScore++;
    
    // Add bonus points for character diversity
    if (password.length >= 8 && diversityScore >= 2) strength += 1;
    
    // Cap at 4
    strength = Math.min(strength, 4);
    
    // Return appropriate feedback
    switch(strength) {
      case 0:
        return { 
          segments: [true, false, false, false], 
          text: "Weak: Add more characters", 
          color: "bg-red-500",
          strength 
        };
      case 1:
        return { 
          segments: [true, true, false, false], 
          text: "Fair: Add more characters", 
          color: "bg-orange-500",
          strength 
        };
      case 2:
        return { 
          segments: [true, true, true, false], 
          text: "Good: Add special characters", 
          color: "bg-yellow-500",
          strength 
        };
      case 3:
        return { 
          segments: [true, true, true, false], 
          text: "Good: Consider adding more complexity", 
          color: "bg-yellow-500",
          strength 
        };
      case 4:
        return { 
          segments: [true, true, true, true], 
          text: "Strong password", 
          color: "bg-green-500",
          strength 
        };
      default:
        return { 
          segments: [false, false, false, false], 
          text: "Password strength indicator", 
          color: null,
          strength: 0 
        };
    }
  };

  const { segments, text, color } = getStrengthInfo(password);

  return (
    <div className="space-y-1.5" aria-live="polite" role="status">
      <div className="flex gap-1.5">
        {segments.map((active, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              active
                ? index === 0 
                  ? "bg-red-500" 
                  : index === 1 
                    ? "bg-orange-500" 
                    : index === 2 
                      ? "bg-yellow-500" 
                      : "bg-green-500"
                : "bg-border/50"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground ml-1 flex items-center gap-1.5">
        {color && <span className={`inline-block w-2 h-2 rounded-full ${color}`} aria-hidden="true"></span>}
        <span>{text}</span>
      </p>
    </div>
  );
});

PasswordStrengthIndicator.displayName = "PasswordStrengthIndicator";

/**
 * StatusMessage component
 * Displays success or error messages with appropriate styling and icons
 */
export const StatusMessage = memo(({ type, message }: StatusMessageProps) => (
  <div 
    className={`
      ${type === "success" 
        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" 
        : "bg-destructive/10 text-destructive border-destructive/20"
      }
      rounded-lg p-4 text-sm mb-6 border flex items-start gap-3
    `}
    role={type === "error" ? "alert" : "status"}
    aria-live={type === "error" ? "assertive" : "polite"}
  >
    <div className="min-w-5 min-h-5 mt-0.5" aria-hidden="true">
      {type === "success" ? Icons.Success : Icons.Error}
    </div>
    <span>{message}</span>
  </div>
));

StatusMessage.displayName = "StatusMessage";

/**
 * SocialButton component
 * Button for social login providers with icon and text
 */
export const SocialButton = memo(({ 
  provider, 
  icon, 
  onClick, 
  disabled 
}: SocialButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="flex items-center justify-center gap-3 h-12 px-4 rounded-lg border border-border/50 bg-background hover:bg-accent/30 transition-all text-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label={`Continue with ${provider}`}
    data-testid={`${provider.toLowerCase()}-login-button`}
  >
    <span aria-hidden="true">{icon}</span>
    <span>Continue with {provider}</span>
  </button>
));

SocialButton.displayName = "SocialButton";

/**
 * Component types
 */
interface IconInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  showPasswordToggle?: boolean;
}

interface RememberMeCheckboxProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  formId: string;
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StatusMessageProps {
  type: "success" | "error";
  message: string;
}

interface SocialButtonProps {
  provider: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}