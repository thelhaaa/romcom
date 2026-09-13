import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlowPillButtonProps {
  children: ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: 'yes' | 'no';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isPulsing?: boolean;
}

export const GlowPillButton: React.FC<GlowPillButtonProps> = ({
  children,
  onClick,
  variant = 'yes',
  size = 'md',
  className = '',
  isPulsing = false,
}) => {
  const sizeClasses = {
    sm: 'px-5 py-2 text-xs font-medium tracking-[0.12em]',
    md: 'px-8 py-3 text-sm sm:text-base font-semibold tracking-[0.14em]',
    lg: 'px-10 py-3.5 sm:px-12 sm:py-4 text-base sm:text-lg font-bold tracking-[0.16em]',
    xl: 'px-12 py-4 sm:px-16 sm:py-4.5 text-lg sm:text-xl font-bold tracking-[0.18em]',
  }[size];

  const isYes = variant === 'yes';

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        y: -1.5,
        transition: { type: 'spring', stiffness: 450, damping: 18 },
      }}
      whileTap={{
        scale: 0.94,
        y: 1,
        transition: { type: 'spring', stiffness: 500, damping: 15 },
      }}
      onClick={onClick}
      className={`relative group overflow-hidden rounded-full select-none cursor-pointer transition-all duration-300 ${sizeClasses} ${className}`}
      style={{
        boxShadow: isYes
          ? '0 12px 35px -6px rgba(255, 42, 133, 0.45), 0 4px 15px rgba(255, 125, 167, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.7), inset 0 -2px 6px rgba(0, 0, 0, 0.35)'
          : '0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.25), inset 0 -2px 4px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* 1. Iridescent / Metallic Border Wrapper */}
      <div
        className={`absolute inset-0 rounded-full p-[1px] pointer-events-none transition-opacity duration-300 ${
          isYes
            ? 'bg-gradient-to-r from-[#ffe4a0] via-[#ff6599] to-[#ffd166] opacity-90 group-hover:opacity-100'
            : 'bg-gradient-to-r from-pink-300/40 via-white/30 to-rose-400/30 opacity-60 group-hover:opacity-100'
        }`}
      >
        <div
          className={`w-full h-full rounded-full ${
            isYes
              ? 'bg-gradient-to-b from-[#e62060] via-[#c4144e] to-[#800a30]'
              : 'bg-gradient-to-b from-[#1e1019]/95 via-[#150a12]/95 to-[#0a0408]/95 backdrop-blur-xl'
          }`}
        />
      </div>

      {/* 2. Sweeping Diagonal Gloss Light Shimmer */}
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        <div
          className={`absolute inset-y-0 w-1/2 -skew-x-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isYes
              ? 'bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-sweep'
              : 'bg-gradient-to-r from-transparent via-rose-200/20 to-transparent animate-shimmer-sweep'
          }`}
          style={{ width: '60%' }}
        />
      </div>

      {/* 3. Top Rim Specular Glint */}
      <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-white/75 to-transparent pointer-events-none opacity-80" />

      {/* 4. Ambient Core Heartbeat Pulse */}
      {isPulsing && isYes && (
        <div className="absolute inset-0 rounded-full bg-pink-500/20 animate-pulse pointer-events-none" />
      )}

      {/* 5. Luxury Typography & Label in Montserrat / SF Pro / Helvetica */}
      <span
        className={`relative z-10 flex items-center justify-center gap-2 uppercase font-button font-bold tracking-[0.16em] ${
          isYes
            ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]'
            : 'text-[#f5c2d3] group-hover:text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] transition-colors'
        }`}
      >
        {isYes && <span className="text-xs sm:text-sm text-yellow-200">✦</span>}
        {children}
        {isYes && <span className="text-xs sm:text-sm text-yellow-200">✦</span>}
      </span>
    </motion.button>
  );
};
