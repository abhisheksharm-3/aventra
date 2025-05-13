import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JSX } from 'react';
import { ActionButtonsProps } from '@/types/hero';

/**
 * Action buttons for the hero section
 * @param {ActionButtonsProps} props - Component properties
 * @returns {JSX.Element} Rendered component
 */
export const ActionButtons = ({
  destination,
  onHoverChange
}: ActionButtonsProps): JSX.Element => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8">
      <Link 
        href={`/plan?destination=${encodeURIComponent(destination.name)}`}
        prefetch={false}
      >
        <motion.div
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "group relative overflow-hidden rounded-full",
            "px-8 py-4",
            `bg-gradient-to-r ${destination.buttonGradient} hover:${destination.hoverGradient} text-white`,
            destination.shadowColor
          )}
        >
          {/* Glow effect on hover */}
          <motion.div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              boxShadow: "inset 0 0 20px 5px rgba(255,255,255,0.3)"
            }}
          />
          
          <span className="relative flex items-center justify-center gap-2 text-lg font-medium">
            Create My {destination.name} Trip
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.div>
          </span>
        </motion.div>
      </Link>
      
      <Link href="/inspiration" prefetch={false}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 rounded-full text-lg font-medium bg-black/40 hover:bg-black/50 text-white backdrop-blur-md border border-white/20 transition-colors duration-300 shadow-lg"
        >
          Explore Ideas
        </motion.button>
      </Link>
    </div>
  );
};