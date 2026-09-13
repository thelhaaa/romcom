import React from 'react';
import { motion } from 'framer-motion';

interface TulipBouquetProps {
  className?: string;
  mirrored?: boolean;
}

export const TulipBouquet: React.FC<TulipBouquetProps> = ({
  className = "w-28 sm:w-36 md:w-44",
  mirrored = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.85, y: 0 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className={`select-none pointer-events-none opacity-80 hover:opacity-100 transition-opacity ${className} ${
        mirrored ? 'scale-x-[-1]' : ''
      }`}
    >
      <svg
        viewBox="0 0 160 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_2px_15px_rgba(255,112,166,0.3)]"
      >
        <defs>
          <linearGradient id="softTulipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffd4e7" />
            <stop offset="55%" stopColor="#ff4d94" />
            <stop offset="100%" stopColor="#800030" />
          </linearGradient>
          <linearGradient id="softStemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e4726" />
            <stop offset="100%" stopColor="#0f2915" />
          </linearGradient>
        </defs>

        {/* Delicate Stems */}
        <path d="M45 120 Q65 155 78 200" stroke="url(#softStemGrad)" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M80 105 Q85 150 84 200" stroke="url(#softStemGrad)" strokeWidth="6" strokeLinecap="round" />
        <path d="M110 115 Q98 155 90 200" stroke="url(#softStemGrad)" strokeWidth="5.5" strokeLinecap="round" />

        {/* Environmental Leaves */}
        <path d="M78 170 Q42 150 32 110 Q58 132 80 160 Z" fill="#14361c" opacity="0.8" />
        <path d="M84 165 Q120 148 130 102 Q108 130 82 156 Z" fill="#1a4223" opacity="0.8" />

        {/* Left Tulip */}
        <g transform="translate(22, 50) rotate(-12)">
          <path d="M26 65 C8 44 8 22 26 8 C30 26 33 48 26 65 Z" fill="url(#softTulipGrad)" />
          <path d="M26 65 C44 44 44 22 26 8 C22 26 19 48 26 65 Z" fill="url(#softTulipGrad)" />
          <path d="M26 65 C16 40 19 16 26 4 C33 16 36 40 26 65 Z" fill="#ffdbe9" />
        </g>

        {/* Center Main Tulip */}
        <g transform="translate(54, 18)">
          <path d="M30 75 C10 52 10 22 30 8 C35 28 38 54 30 75 Z" fill="url(#softTulipGrad)" />
          <path d="M30 75 C50 52 50 22 30 8 C25 28 22 54 30 75 Z" fill="url(#softTulipGrad)" />
          <path d="M30 75 C18 46 22 14 30 0 C38 14 42 46 30 75 Z" fill="#ffdbe9" />
        </g>

        {/* Right Tulip */}
        <g transform="translate(88, 42) rotate(12)">
          <path d="M26 65 C8 44 8 22 26 8 C30 26 33 48 26 65 Z" fill="url(#softTulipGrad)" />
          <path d="M26 65 C44 44 44 22 26 8 C22 26 19 48 26 65 Z" fill="url(#softTulipGrad)" />
          <path d="M26 65 C16 40 19 16 26 4 C33 16 36 40 26 65 Z" fill="#ffdbe9" />
        </g>
      </svg>
    </motion.div>
  );
};
