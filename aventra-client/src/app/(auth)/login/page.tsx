import LoginForm from "@/components/forms/login-form"
import Layout from "@/components/layout/Layout"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Login | Aventra",
  description: "Sign in to your account to continue your journey",
}

export default function LoginPage() {
  return (
    <Layout>
        <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative Section */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-primary/5 via-primary/10 to-background">
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated shapes */}
          <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-primary/20 animate-drift-slow"></div>
          <div className="absolute top-[40%] right-[10%] w-40 h-40 rounded-full bg-blue-500/10 animate-drift-medium"></div>
          <div className="absolute bottom-[15%] left-[30%] w-52 h-52 rounded-full bg-indigo-500/10 animate-drift-fast"></div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/90"></div>
          
          {/* Glass panel with branding */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         w-[80%] max-w-md p-10 rounded-2xl backdrop-blur-xl 
                         border border-white/10 bg-white/5">
            <div className="mb-6">
              <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-primary" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h2 className="font-serif text-4xl font-medium text-primary/90 mb-4">Your Journey Awaits</h2>
              <p className="text-primary/70 leading-relaxed">
                Access your personalized dashboard, track your progress, and continue your adventure in a 
                secure and seamless environment.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-primary/80 text-sm">Advanced analytics and visualization</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-primary/80 text-sm">Personalized recommendations</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-primary/80 text-sm">Secure cloud synchronization</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
        
        <div className="w-full max-w-md z-10">
          <div className="text-center mb-10">
            <div className="inline-block mb-5">
              <div className="h-14 w-14 bg-primary/5 rounded-xl border border-primary/20 shadow-sm shadow-primary/10 flex items-center justify-center mx-auto">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-primary" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
            </div>
            <h1 className="font-serif text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 leading-[1.1] mb-3">
              Welcome <span className="text-primary/80">Back</span>
            </h1>
            <p className="text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Sign in to continue your journey and unlock your full potential
            </p>
          </div>

          <LoginForm />

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 py-3 px-4 rounded-full bg-primary/5 border border-primary/10 text-sm text-muted-foreground shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M19 11H5V21H19V11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 9V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Enterprise-grade security protocols</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  )
}