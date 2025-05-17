import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * SkipLink component props
 */
interface SkipLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  /** The target ID to skip to (without the # prefix) */
  targetId: string;
}

/**
 * Accessibility component that allows keyboard users to skip navigation
 * 
 * This component is visually hidden but becomes visible when focused,
 * allowing keyboard users to skip directly to the main content.
 * 
 * @param props - Component props
 * @returns Accessible skip link component
 */
const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ targetId, className, children = "Skip to content", ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={`#${targetId}`}
        className={cn(
          "absolute left-4 top-4 z-50 -translate-y-full transform rounded-md bg-primary px-4 py-2 text-white opacity-0 transition-transform focus:translate-y-0 focus:opacity-100",
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

SkipLink.displayName = "SkipLink";

export default SkipLink;