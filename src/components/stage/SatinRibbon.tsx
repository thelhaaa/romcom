import React from 'react';
import { motion } from 'framer-motion';

export type RibbonPlacement = 'hanging_drape' | 'subtle_knot' | 'corner_fold';

interface SatinRibbonProps {
  placement?: RibbonPlacement;
  className?: string;
  animated?: boolean;
}

/**
 * Editorial Satin Ribbon
 * Physical fabric object with natural folds, believable drape curves, and soft fabric shading.
 * Built with realistic vector paths and muted burgundy/dusty-rose gradients rather than plastic glossy clip-art.
 */
export const SatinRibbon: React.FC<SatinRibbonProps> = ({
  placement = 'hanging_drape',
  className = '',
  animated = true,
}) => {
  // 1. HANGING DRAPE: Elegant asymmetric ribbon hanging along a corner or edge
  if (placement === 'hanging_drape') {
    return (
      <motion.div
        animate={
          animated
            ? {
                rotate: [-1, 1.2, -1],
                y: [0, 2, 0],
              }
            : undefined
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`pointer-events-none select-none ${className}`}
      >
        <svg
          viewBox="0 0 160 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* Satin Fabric Front Sheen: Rich Bordeaux to Dusty Rose */}
            <linearGradient id="satinFront" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#8f1d40" />
              <stop offset="40%" stopColor="#d4708f" />
              <stop offset="70%" stopColor="#a61e4d" />
              <stop offset="100%" stopColor="#4d0e22" />
            </linearGradient>

            {/* Satin Fabric Underside / Deep Shadow: Dark Burgundy */}
            <linearGradient id="satinBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3d0b1a" />
              <stop offset="100%" stopColor="#1a040b" />
            </linearGradient>

            {/* Subtle Edge Highlight */}
            <linearGradient id="satinEdge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          {/* Top Knot / Twist Anchor */}
          <path
            d="M65 15 C75 8 95 8 105 18 C112 28 100 38 85 40 C70 38 58 28 65 15 Z"
            fill="url(#satinFront)"
            stroke="#21050e"
            strokeWidth="1.2"
          />

          {/* Back Underside Fold */}
          <path
            d="M72 38 C60 70 45 110 55 160 C58 175 68 185 75 190 C68 150 78 95 85 40 Z"
            fill="url(#satinBack)"
          />

          {/* Main Flowing Long Tail with Natural S-Curves */}
          <path
            d="M85 38 C95 85 115 130 108 185 C102 225 78 245 65 255 L58 238 C75 228 92 205 95 175 C102 125 82 85 75 38 Z"
            fill="url(#satinFront)"
            stroke="#2b0713"
            strokeWidth="1"
          />
          {/* Subtle Crease Line along the Tail */}
          <path
            d="M82 48 C90 95 106 135 100 180 C95 210 75 235 66 248"
            stroke="url(#satinEdge)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Secondary Shorter Draped Tail */}
          <path
            d="M68 35 C50 65 35 105 42 140 C46 158 58 172 70 180 L76 168 C66 160 55 148 52 135 C46 105 58 72 72 35 Z"
            fill="url(#satinFront)"
            stroke="#2b0713"
            strokeWidth="1"
          />

          {/* Small V-Notch on Lower Hem */}
          <path
            d="M65 255 L72 246 L80 258"
            stroke="#2b0713"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </motion.div>
    );
  }

  // 2. CORNER FOLD: Soft diagonal ribbon fold across a corner frame
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
      >
        <path
          d="M0 45 L45 0 L68 0 L0 68 Z"
          fill="#8f1d40"
          stroke="#3d0b1a"
          strokeWidth="1"
        />
        <path
          d="M5 45 L45 5"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
