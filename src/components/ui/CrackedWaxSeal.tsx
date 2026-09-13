import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../../utils/audioEngine';
import { triggerHaptic } from '../../hooks/useMobileSensors';

interface CrackedWaxSealProps {
  onCrack?: () => void;
  isCracked?: boolean;
  className?: string;
  size?: number;
}

export const CrackedWaxSeal: React.FC<CrackedWaxSealProps> = ({
  onCrack,
  isCracked: extIsCracked,
  className = '',
  size = 110,
}) => {
  const [internalCracked, setInternalCracked] = useState(false);
  const isCracked = extIsCracked !== undefined ? extIsCracked : internalCracked;

  const handleSealClick = () => {
    if (isCracked) return;

    sound.playWaxCrack();
    triggerHaptic([45, 30, 75]);
    setInternalCracked(true);
    if (onCrack) {
      onCrack();
    }
  };

  return (
    <div
      className={`relative select-none flex items-center justify-center cursor-pointer group ${className}`}
      onClick={handleSealClick}
      style={{ width: size, height: size }}
    >
      {/* Golden halo glow behind seal */}
      <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl scale-125 pointer-events-none group-hover:scale-150 transition-transform duration-700" />

      {/* Floating hint label */}
      {!isCracked && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-7 px-3 py-0.5 rounded-full bg-[#180414]/80 backdrop-blur-md border border-rose-500/30 text-[11px] font-sans font-medium text-rose-200 shadow-lg pointer-events-none whitespace-nowrap tracking-wide"
        >
          break seal ✦
        </motion.div>
      )}

      {/* Flying Wax Crumbs on Crack */}
      <AnimatePresence>
        {isCracked && (
          <>
            {[
              { x: -45, y: -35, r: -40, s: 6 },
              { x: 50, y: -28, r: 60, s: 8 },
              { x: -38, y: 40, r: -70, s: 7 },
              { x: 42, y: 36, r: 50, s: 5 },
              { x: 0, y: -55, r: 20, s: 9 },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0.4,
                  x: f.x * (1 + Math.random() * 0.4),
                  y: f.y * (1 + Math.random() * 0.4),
                  rotate: f.r,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute rounded-full pointer-events-none bg-gradient-to-br from-[#d91d4e] to-[#730a24] shadow-md border border-rose-400/40"
                style={{ width: f.s, height: f.s }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* 3D Wax Seal SVG with Fracture Halves */}
      <div className="relative w-full h-full">
        {/* Left Half of Wax Seal */}
        <motion.div
          animate={
            isCracked
              ? {
                  x: -24,
                  y: 8,
                  rotate: -18,
                  opacity: 0.88,
                }
              : {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                }
          }
          whileHover={!isCracked ? { scale: 1.05 } : {}}
          whileTap={!isCracked ? { scale: 0.94 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
          style={{ clipPath: isCracked ? 'polygon(0 0, 52% 0, 48% 35%, 54% 65%, 46% 100%, 0 100%)' : undefined }}
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)]">
            <defs>
              <radialGradient id="waxGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ff4d79" />
                <stop offset="45%" stopColor="#b91340" />
                <stop offset="85%" stopColor="#750622" />
                <stop offset="100%" stopColor="#430110" />
              </radialGradient>
              <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffe699" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#d4af37" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#aa7c11" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            <path
              d="M50 4 C68 3 84 10 93 25 C100 37 98 56 94 70 C89 85 75 97 55 96 C36 95 20 92 10 78 C1 66 2 48 8 32 C15 15 32 5 50 4 Z"
              fill="url(#waxGrad)"
              stroke="url(#goldRim)"
              strokeWidth="1.8"
            />
            <circle cx="50" cy="50" r="34" fill="#8b0c2e" stroke="#e63967" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#ffe699" strokeWidth="0.8" opacity="0.6" />
            <path
              d="M50 38 C50 38 44 28 36 30 C28 32 27 42 34 50 L50 66 L66 50 C73 42 72 32 64 30 C56 28 50 38 50 38 Z"
              fill="#d91d4e"
              stroke="#ffe699"
              strokeWidth="1.6"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
            />
            <path d="M43 32 L46 35 L50 30 L54 35 L57 32 L56 36 L44 36 Z" fill="#ffe699" opacity="0.9" />
          </svg>
        </motion.div>

        {/* Right Half of Wax Seal */}
        {isCracked && (
          <motion.div
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{
              x: 24,
              y: -6,
              rotate: 16,
              opacity: 0.88,
            }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
            style={{ clipPath: 'polygon(52% 0, 100% 0, 100% 100%, 46% 100%, 54% 65%, 48% 35%)' }}
          >
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.65)]">
              <path
                d="M50 4 C68 3 84 10 93 25 C100 37 98 56 94 70 C89 85 75 97 55 96 C36 95 20 92 10 78 C1 66 2 48 8 32 C15 15 32 5 50 4 Z"
                fill="url(#waxGrad)"
                stroke="url(#goldRim)"
                strokeWidth="1.8"
              />
              <circle cx="50" cy="50" r="34" fill="#8b0c2e" stroke="#e63967" strokeWidth="1.5" strokeDasharray="3 2" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#ffe699" strokeWidth="0.8" opacity="0.6" />
              <path
                d="M50 38 C50 38 44 28 36 30 C28 32 27 42 34 50 L50 66 L66 50 C73 42 72 32 64 30 C56 28 50 38 50 38 Z"
                fill="#d91d4e"
                stroke="#ffe699"
                strokeWidth="1.6"
              />
              <path d="M43 32 L46 35 L50 30 L54 35 L57 32 L56 36 L44 36 Z" fill="#ffe699" opacity="0.9" />
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
};
