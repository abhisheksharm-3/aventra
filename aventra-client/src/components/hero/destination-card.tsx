import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DestinationCardProps } from "@/types/hero";

export const DestinationCard: React.FC<DestinationCardProps> = ({ name, country, image }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative rounded-xl overflow-hidden h-[160px] cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
      <p className="text-white font-medium text-lg">{name}</p>
      <p className="text-white/80 text-sm">{country}</p>
    </div>
    <div className="absolute top-0 right-0 p-2 z-20">
      <div className="bg-background/80 backdrop-blur-sm p-1 rounded-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full bg-muted/30 animate-pulse" />
      <Image 
        src={image}
        alt={`${name}, ${country}`}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        loading="eager"
        priority={true}
      />
    </div>
  </motion.div>
);