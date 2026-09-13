import React from 'react';
import { motion } from 'framer-motion';

interface SilkBowProps {
  className?: string;
  glow?: boolean;
  flipped?: boolean;
}

export const SilkBowHeader: React.FC<SilkBowProps> = ({
  className = "w-28 sm:w-36 md:w-44",
  glow = true,
  flipped = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className={`select-none pointer-events-none opacity-85 hover:opacity-100 transition-opacity ${className} ${
        flipped ? 'scale-x-[-1]' : ''
      }`}
    >
      <svg
        viewBox="0 0 200 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_2px_15px_rgba(255,42,133,0.35)]"
      >
        <defs>
          <radialGradient id="bowSoftAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff2a85" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ff2a85" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="softSilk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd6e7" />
            <stop offset="40%" stopColor="#ff7da7" />
            <stop offset="80%" stopColor="#d61a6c" />
            <stop offset="100%" stopColor="#8a0740" />
          </linearGradient>
          <linearGradient id="silkSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#ffb3d1" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {glow && (
          <circle cx="100" cy="70" r="60" fill="url(#bowSoftAura)" opacity="0.4" />
        )}

        {/* Left Ribbon Tail */}
        <path d="M78 80 C55 110 32 145 18 140 C30 125 48 98 58 80 Z" fill="url(#softSilk)" opacity="0.9" />
        <path d="M78 80 C66 105 48 135 36 138 C44 122 58 98 72 80 Z" fill="url(#silkSheen)" />

        {/* Right Ribbon Tail */}
        <path d="M122 80 C145 110 168 145 182 140 C170 125 152 98 142 80 Z" fill="url(#softSilk)" opacity="0.9" />
        <path d="M122 80 C134 105 152 135 164 138 C156 122 142 98 128 80 Z" fill="url(#silkSheen)" />

        {/* Left Loop */}
        <path d="M96 68 C58 26 8 36 14 70 C19 100 62 90 96 78 Z" fill="url(#softSilk)" />
        <path d="M94 67 C65 37 25 45 28 68 C31 88 66 80 94 76 Z" fill="url(#silkSheen)" opacity="0.65" />

        {/* Right Loop */}
        <path d="M104 68 C142 26 192 36 186 70 C181 100 138 90 104 78 Z" fill="url(#softSilk)" />
        <path d="M106 67 C135 37 175 45 172 68 C169 88 134 80 106 76 Z" fill="url(#silkSheen)" opacity="0.65" />

        {/* Center Knot */}
        <ellipse cx="100" cy="72" rx="16" ry="13" fill="url(#softSilk)" />
        <ellipse cx="100" cy="70" rx="12" ry="9" fill="url(#silkSheen)" opacity="0.75" />
      </svg>
    </motion.div>
  );
};
