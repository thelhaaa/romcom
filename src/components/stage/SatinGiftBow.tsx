import React from 'react';
import { motion } from 'framer-motion';

interface SatinGiftBowProps {
  className?: string;
  animated?: boolean;
}

/**
 * Authentic Satin Gift Bow
 * Anatomically correct 5-part gift ribbon bow:
 * 1. Central Wrapped Knot with diagonal fabric tuck
 * 2. Left Loop with inner loop opening and satin highlight crest
 * 3. Right Loop with inner loop opening and satin highlight crest
 * 4. Left Tail with natural fabric twist and swallowtail V-notch
 * 5. Right Tail with natural fabric twist and swallowtail V-notch
 *
 * Designed to pass the silhouette test at thumbnail, medium, and large sizes with ZERO glow.
 */
export const SatinGiftBow: React.FC<SatinGiftBowProps> = ({
  className = '',
  animated = true,
}) => {
  const ink = '#21040e';

  // Animation variants for component-based natural unfold
  const knotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const loopLeftVariants = {
    hidden: { scale: 0.2, opacity: 0, rotate: 15, transformOrigin: '155px 98px' },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const loopRightVariants = {
    hidden: { scale: 0.2, opacity: 0, rotate: -15, transformOrigin: '165px 98px' },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.7, delay: 0.28, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const tailsVariants = {
    hidden: { scaleY: 0.1, opacity: 0, transformOrigin: '160px 110px' },
    visible: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      animate={
        animated
          ? {
              y: [0, -2.5, 0],
              rotate: [-0.5, 0.5, -0.5],
            }
          : undefined
      }
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`relative flex items-center justify-center select-none ${className}`}
    >
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
      >
        <defs>
          {/* Main Satin Loop Sheen Gradient */}
          <linearGradient id="bowSatinSheen" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#ff7da7" />
            <stop offset="25%" stopColor="#d6336c" />
            <stop offset="65%" stopColor="#8f1d40" />
            <stop offset="100%" stopColor="#4a0f23" />
          </linearGradient>

          {/* Underside / Inner Cavity Shadow */}
          <linearGradient id="bowUnderside" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d0b1a" />
            <stop offset="100%" stopColor="#19040a" />
          </linearGradient>

          {/* Soft Highlight Ridge */}
          <linearGradient id="bowHighlight" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>

          {/* Knot Gradient */}
          <linearGradient id="knotGradient" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#ff85ab" />
            <stop offset="40%" stopColor="#c2255c" />
            <stop offset="100%" stopColor="#4a0e22" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* 4 & 5. RIBBON TAILS (Cascading Downward with Swallowtail Cuts) */}
        {/* ============================================================== */}
        <motion.g
          initial={animated ? 'hidden' : 'visible'}
          animate="visible"
          variants={tailsVariants}
        >
          {/* Left Tail - Rear Underside Shadow Fold */}
          <path
            d="M152 110 C135 150 115 185 92 230 L115 220 C135 180 148 145 158 115 Z"
            fill="url(#bowUnderside)"
          />

          {/* Left Tail - Main Flowing Satin Ribbon */}
          <path
            d="M148 112 C132 155 110 195 82 245 L108 226 L124 252 C142 205 156 160 162 118 Z"
            fill="url(#bowSatinSheen)"
            stroke={ink}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Left Tail - Highlight Crease */}
          <path
            d="M152 120 C138 160 118 200 96 238"
            stroke="url(#bowHighlight)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Right Tail - Rear Underside Shadow Fold */}
          <path
            d="M168 110 C185 150 205 185 228 230 L205 220 C185 180 172 145 162 115 Z"
            fill="url(#bowUnderside)"
          />

          {/* Right Tail - Main Flowing Satin Ribbon */}
          <path
            d="M172 112 C188 155 210 195 238 245 L212 226 L196 252 C178 205 164 160 158 118 Z"
            fill="url(#bowSatinSheen)"
            stroke={ink}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Right Tail - Highlight Crease */}
          <path
            d="M168 120 C182 160 202 200 224 238"
            stroke="url(#bowHighlight)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </motion.g>

        {/* ============================================================== */}
        {/* 2. LEFT LOOP (Volumetric Satin Loop with Inner Opening)        */}
        {/* ============================================================== */}
        <motion.g
          initial={animated ? 'hidden' : 'visible'}
          animate="visible"
          variants={loopLeftVariants}
        >
          {/* Left Loop - Outer Shell */}
          <path
            d="M148 88 C120 55 75 32 46 45 C18 56 16 88 32 108 C50 128 100 120 148 106 Z"
            fill="url(#bowSatinSheen)"
            stroke={ink}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Left Loop - Inner Hole / Shadowed Underbelly */}
          <path
            d="M142 92 C108 82 72 72 48 76 C38 78 36 90 44 98 C58 110 98 106 142 100 Z"
            fill="url(#bowUnderside)"
            stroke={ink}
            strokeWidth="1.2"
          />

          {/* Left Loop - Top Crest Sheen */}
          <path
            d="M135 78 C105 52 70 42 46 50 C32 55 26 68 28 80"
            stroke="url(#bowHighlight)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </motion.g>

        {/* ============================================================== */}
        {/* 3. RIGHT LOOP (Volumetric Satin Loop with Inner Opening)       */}
        {/* ============================================================== */}
        <motion.g
          initial={animated ? 'hidden' : 'visible'}
          animate="visible"
          variants={loopRightVariants}
        >
          {/* Right Loop - Outer Shell */}
          <path
            d="M172 88 C200 55 245 32 274 45 C302 56 304 88 288 108 C270 128 220 120 172 106 Z"
            fill="url(#bowSatinSheen)"
            stroke={ink}
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Right Loop - Inner Hole / Shadowed Underbelly */}
          <path
            d="M178 92 C212 82 248 72 272 76 C282 78 284 90 276 98 C262 110 222 106 178 100 Z"
            fill="url(#bowUnderside)"
            stroke={ink}
            strokeWidth="1.2"
          />

          {/* Right Loop - Top Crest Sheen */}
          <path
            d="M185 78 C215 52 250 42 274 50 C288 55 294 68 292 80"
            stroke="url(#bowHighlight)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </motion.g>

        {/* ============================================================== */}
        {/* 1. CENTRAL WRAPPED KNOT (Dimensionally anchors the loops)       */}
        {/* ============================================================== */}
        <motion.g
          initial={animated ? 'hidden' : 'visible'}
          animate="visible"
          variants={knotVariants}
        >
          {/* Knot Base Contour with Soft Organic Pinch */}
          <path
            d="M145 82 C152 76 168 76 175 82 C182 92 182 108 174 116 C167 122 153 122 146 116 C138 108 138 92 145 82 Z"
            fill="url(#knotGradient)"
            stroke={ink}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Knot Diagonal Fabric Crease */}
          <path
            d="M148 85 C156 94 165 104 172 114"
            stroke="#4a0e22"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Knot Highlight Reflection */}
          <path
            d="M152 80 C158 78 166 80 170 85"
            stroke="url(#bowHighlight)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
};
