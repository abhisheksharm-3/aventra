import { motion } from "framer-motion";
import { Search, History, Sparkles } from "lucide-react";
import { SearchSuggestionProps } from "@/types/hero";

/**
 * @component SearchSuggestion
 * @description Renders a single search suggestion with appropriate icon and styling based on its type.
 * The suggestion can be any trip context, requirements, or search query.
 * Includes hover animations and visual feedback for better user experience.
 * 
 * @param {Object} props - Component props
 * @param {string} props.suggestion - The suggestion text to display
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} [props.isRecent] - Whether this is a recent search item
 * @param {boolean} [props.isAutocomplete] - Whether this is an autocomplete suggestion
 * @returns {JSX.Element} Rendered search suggestion
 */
export const SearchSuggestion = ({
  suggestion,
  onClick,
  isRecent = false,
  isAutocomplete = false
}: SearchSuggestionProps) => {
  // Determine which icon to show based on the suggestion type
  const renderIcon = () => {
    if (isRecent) {
      return <History className="h-4 w-4 text-muted-foreground/70" />;
    } else if (isAutocomplete) {
      return <Sparkles className="h-4 w-4 text-primary" />;
    } else {
      return <Search className="h-4 w-4 text-muted-foreground/70" />;
    }
  };

  // Determine the label for screen readers
  const ariaLabel = isRecent 
    ? `Recent search: ${suggestion}` 
    : `Suggested search: ${suggestion}`;

  return (
    <motion.div
      whileHover={{ scale: 1.01, backgroundColor: "rgba(var(--accent), 0.15)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`
        flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer
        transition-all duration-200 group
        ${isAutocomplete ? 'border-l-2 border-primary/50' : ''}
      `}
      onClick={onClick}
      role="option"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <div className={`
        flex items-center justify-center p-1.5 rounded-full
        ${isRecent ? 'bg-muted/50 group-hover:bg-muted' : ''}
        ${isAutocomplete ? 'bg-primary/10 group-hover:bg-primary/20' : ''}
        ${!isRecent && !isAutocomplete ? 'bg-accent/40 group-hover:bg-accent/60' : ''}
      `}>
        {renderIcon()}
      </div>
      
      <span className="text-sm font-medium truncate flex-1">{suggestion}</span>
      
      {isAutocomplete && (
        <div className="hidden group-hover:block">
          <span className="text-xs font-medium text-primary px-2 py-0.5 bg-primary/10 rounded-full">
            Use
          </span>
        </div>
      )}
    </motion.div>
  );
};