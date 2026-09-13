import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HolographicStickerProps {
  children: React.ReactNode;
  rotation?: number;
  className?: string;
  variant?: 'pink' | 'gold' | 'chrome' | 'cream';
  onClick?: () => void;
}

export const HolographicSticker: React.FC<HolographicStickerProps> = ({
  children,
  rotation = 0,
  className = '',
  variant = 'pink',
  onClick,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -y * 22, y: x * 22 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Color schemes for Gen-Z stickers
  const variantStyles = {
    pink: 'bg-gradient-to-br from-[#2f0d22] via-[#21091a] to-[#120410] border-pink-400/40 text-[#fbcfe8]',
    gold: 'bg-gradient-to-br from-[#2a1d0d] via-[#1c1308] to-[#0f0904] border-amber-300/50 text-[#fef08a]',
    chrome: 'bg-gradient-to-br from-[#1a1c23] via-[#121418] to-[#0a0b0d] border-cyan-300/40 text-[#e0f2fe]',
    cream: 'bg-[#faf6f0] border-[#ebd8c5] text-[#4a1525] shadow-md',
  };

  return (
    <motion.div
      style={{
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotate: rotation,
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? 1.08 : 1,
        y: isHovered ? -4 : 0,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border backdrop-blur-md shadow-[0_6px_20px_rgba(0,0,0,0.5)] cursor-pointer select-none overflow-hidden group ${variantStyles[variant]} ${className}`}
    >
      {/* Holographic Iridescent Sheen Layer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-75 transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(115deg, transparent 20%, rgba(255, 125, 167, 0.45) 40%, rgba(130, 238, 253, 0.45) 60%, rgba(254, 240, 138, 0.45) 80%, transparent 100%)',
          backgroundSize: '200% 200%',
          mixBlendMode: 'screen',
        }}
      />

      {/* Glossy Diagonal Specular Highlight Bar */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-1.5">
        {children}
      </div>
    </motion.div>
  );
};
