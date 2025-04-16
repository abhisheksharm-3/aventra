import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import { useState } from "react"
import { ControllerRenderProps, Control, FieldPath, FieldValues } from "react-hook-form"

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

export const IconInput = <
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
  
  return (
    <div className="group">
      <div className="relative rounded-lg overflow-hidden bg-accent/20 backdrop-blur-sm border border-border/40 hover:border-primary/20 transition-colors">
        <div className="absolute left-4 top-0 bottom-0 flex items-center text-muted-foreground">
          {icon}
        </div>
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            type={showPasswordToggle ? (showPassword ? "text" : "password") : type}
            className="h-14 border-0 bg-transparent pl-12 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </FormControl>
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export const RememberMeCheckbox = <TFieldValues extends FieldValues>({ 
  control, 
  name, 
  formId 
}: { 
  control: Control<TFieldValues>; 
  name: FieldPath<TFieldValues>; 
  formId: string;
}) => (
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
)

export const Icons = {
    Email: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </svg>
    ),
    Password: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    User: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    Google: (
      <svg width="20" height="20" viewBox="0 0 24 24" className="text-red-500">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    GitHub: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
      </svg>
    ),
    Spinner: (
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ),
    Error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    ),
    Success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    )
  }
  
  export const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const getStrengthInfo = (length: number) => {
      if (length === 0) return { segments: [false, false, false, false], text: "Password strength indicator", color: null };
      if (length < 5) return { segments: [true, false, false, false], text: "Weak: Add more characters", color: "bg-red-500" };
      if (length < 8) return { segments: [true, true, false, false], text: "Fair: Add more characters", color: "bg-orange-500" };
      if (length < 10) return { segments: [true, true, true, false], text: "Good: Consider adding special characters", color: "bg-yellow-500" };
      return { segments: [true, true, true, true], text: "Strong password", color: "bg-green-500" };
    };
  
    const { segments, text, color } = getStrengthInfo(password.length);
  
    return (
      <div className="space-y-1.5">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((segment) => (
            <div
              key={segment}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                segments[segment - 1]
                  ? segment === 1 ? "bg-red-500" : segment === 2 ? "bg-orange-500" : segment === 3 ? "bg-yellow-500" : "bg-green-500"
                  : "bg-border/50"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground ml-1 flex items-center gap-1.5">
          {color && <span className={`inline-block w-2 h-2 rounded-full ${color}`}></span>}
          <span>{text}</span>
        </p>
      </div>
    );
  };
  
  export const StatusMessage = ({ type, message }: { type: "success" | "error", message: string }) => (
    <div className={`
      ${type === "success" ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}
      rounded-lg p-4 text-sm mb-6 border flex items-start gap-3
    `}>
      <div className="min-w-5 min-h-5 mt-0.5">
        {type === "success" ? Icons.Success : Icons.Error}
      </div>
      <span>{message}</span>
    </div>
  );
  
  export const SocialButton = ({ provider, icon, onClick, disabled }: { 
    provider: string, 
    icon: React.ReactNode, 
    onClick: () => void, 
    disabled: boolean 
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-3 h-12 px-4 rounded-lg border border-border/50 bg-background hover:bg-accent/30 transition-all text-foreground cursor-pointer"
    >
      {icon}
      <span>Continue with {provider}</span>
    </button>
  );