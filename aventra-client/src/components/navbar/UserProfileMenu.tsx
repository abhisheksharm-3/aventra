"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Settings, CreditCard, LogOut, AlertCircle } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const UserProfileMenu = () => {
  const { user, isLoading: userLoading } = useUser();
  const { signOut, isLoading: authLoading, error } = useAuth({
    redirectAfterLogout: '/login'
  });
  const router = useRouter();

  const isLoading = userLoading || authLoading;

  // Handle any auth errors with toast notifications
  useEffect(() => {
    if (error) {
      toast.error("Authentication Error",{
        description: error,
        action: (
          <div className="h-8 w-8 bg-destructive/15 rounded-full flex items-center justify-center">
            <AlertCircle className="h-4 w-4" />
          </div>
        ),
      });
    }
  }, [error]);

  // Properly implemented logout handler using the auth hook
  const handleLogout = async () => {
    try {
      const result = await signOut();
      
      if (result.success) {
        // Success is handled by the hook with auto-redirect
        toast.success("Logged out successfully",{
          description: "You have been logged out of your account.",
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error("Logged out successfully",{
        description: "Please try again or contact support if the issue persists.",
      });
    }
  };

  // If still loading user data, show loading state
  if (userLoading) {
    return (
      <Button variant="ghost" className="h-9 rounded-full" disabled>
        <div className="h-7 w-7 rounded-full bg-muted animate-pulse"></div>
      </Button>
    );
  }

  // If no user after loading completes, don't render the menu
  if (!user) return null;

  // Extract user data
  const userName = user.name || 'User';
  const userEmail = user.email || '';
  const userInitials = userName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Calculate premium renewal date
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);
  const formattedRenewalDate = renewalDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const isPremium = user.labels?.includes('premium') || false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-9 rounded-full pl-2 pr-3 hover:bg-background/80 transition-all"
        >
          <div className="flex items-center justify-center gap-2">
            <Avatar className="h-7 w-7 ring-2 ring-primary/10">
              <AvatarImage
                src={user.avatarUrl || "https://avatar.iran.liara.run/public"}
                alt={userName}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-blue-500/20 text-foreground">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-col items-start hidden sm:flex">
              <span className="text-sm font-medium">
                {userName.split(' ')[0]}
              </span>
              {isPremium && (
                <div className="flex items-center">
                  <span className="text-[10px] font-medium bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
                    PREMIUM
                  </span>
                  <div className="ml-1 w-1 h-1 rounded-full bg-primary/70"></div>
                </div>
              )}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 p-2 backdrop-blur-xl bg-card/95 border border-border/30 rounded-xl shadow-xl"
        sideOffset={8}
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-500/5 pointer-events-none opacity-80"></div>
          <div className="relative flex items-center gap-3 p-3 mb-1">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10 shadow-sm">
              <AvatarImage
                src={user.avatarUrl || "https://avatar.iran.liara.run/public"}
                alt={userName}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-blue-500/20 text-foreground">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{userName}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {isPremium && (
          <div className="px-1.5 py-1.5 mb-1">
            <div className="flex items-center justify-between bg-muted/30 rounded-lg p-2">
              <div className="flex flex-col">
                <span className="text-xs font-medium">Premium Plan</span>
                <span className="text-[10px] text-muted-foreground">Renews {formattedRenewalDate}</span>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] h-5">ACTIVE</Badge>
            </div>
          </div>
        )}
        
        <DropdownMenuSeparator className="my-1 bg-border/20" />
        
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
            onClick={() => router.push('/profile')}
          >
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
            onClick={() => router.push('/settings')}
          >
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-md cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
            onClick={() => router.push('/billing')}
          >
            <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="my-1 bg-border/20" />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2.5 py-1.5 px-2 rounded-md cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50/10 focus:bg-red-50/10 focus:text-red-600"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="text-sm">{authLoading ? 'Logging out...' : 'Log out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;