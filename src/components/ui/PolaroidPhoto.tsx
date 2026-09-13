import React from 'react';
import { motion } from 'framer-motion';

interface PolaroidPhotoProps {
  caption?: string;
  rotation?: number;
  className?: string;
  children: React.ReactNode;
}

export const PolaroidPhoto: React.FC<PolaroidPhotoProps> = ({
  caption = 'us forever ♡',
  rotation = -3,
  className = '',
  children,
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        rotate: rotation > 0 ? rotation + 2 : rotation - 2,
        zIndex: 25,
        transition: { type: 'spring', stiffness: 350, damping: 18 },
      }}
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`relative bg-[#fcfbfa] p-3 pb-5 rounded-sm shadow-[0_16px_35px_rgba(0,0,0,0.65),0_2px_6px_rgba(0,0,0,0.2)] border border-[#e8dfd5] select-none text-center inline-block ${className}`}
    >
      {/* Top Metallic Brass Paperclip */}
      <div className="absolute -top-3 left-4 w-4 h-8 z-30 pointer-events-none">
        <svg viewBox="0 0 24 48" fill="none" className="w-full h-full drop-shadow-[1px_2px_3px_rgba(0,0,0,0.4)]">
          <path
            d="M 6 12 L 6 36 C 6 42 18 42 18 36 L 18 8 C 18 2 8 2 8 8 L 8 32 C 8 36 14 36 14 32 L 14 14"
            stroke="#d4af37"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Picture Frame */}
      <div className="relative overflow-hidden bg-[#1f0b1a] rounded-sm flex items-center justify-center p-2 min-h-[140px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
        {/* Subtle photo flash vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none z-10" />
        <div className="relative z-0">
          {children}
        </div>
      </div>

      {/* Hand-scribbled Caption */}
      <div className="mt-2.5 font-doodle text-base sm:text-lg text-[#3b1f2b] tracking-wide font-bold">
        {caption}
      </div>
    </motion.div>
  );
};
