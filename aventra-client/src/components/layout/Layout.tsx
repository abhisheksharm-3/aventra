import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import NavbarComponent from "./Navbar";
import Footer from "./Footer";
import SkipLink from "./SkipLink";

/**
 * Layout component props
 */
interface LayoutProps {
  /** Optional CSS class names to apply to the layout container */
  className?: string;
  
  /** React children to render inside the layout */
  children: ReactNode;
  
  /** Whether to show the navigation bar (default: true) */
  showNav?: boolean;
  
  /** Whether to show the footer (default: true) */
  showFooter?: boolean;
  
  /** Optional ID for the main content area */
  contentId?: string;
}

/**
 * Main layout component that wraps all pages
 * 
 * Provides consistent page structure with navigation and footer.
 * Supports customization through props for different page layouts.
 * Includes accessibility features like skip navigation.
 * 
 * @param props - Component props
 * @returns Layout component with navigation, content area, and footer
 */
const Layout = ({
  className,
  children,
  showNav = true,
  showFooter = true,
  contentId = "main-content"
}: LayoutProps) => {
  return (
    <>
      <SkipLink targetId={contentId} />
      <div
        className={cn(
          "flex min-h-screen flex-col justify-between font-sans",
          className
        )}
      >
        {showNav && <NavbarComponent />}
        
        <main 
          id={contentId}
          className="flex-grow"
          role="main"
          aria-label="Main content"
        >
          {children}
        </main>
        
        {showFooter && <Footer />}
      </div>
    </>
  );
};

export default Layout;