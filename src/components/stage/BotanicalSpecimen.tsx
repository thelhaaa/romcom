import React from 'react';
import { motion } from 'framer-motion';

export type BotanicalVariant =
  | 'tulip_stem'
  | 'corner_spray'
  | 'pressed_petals'
  | 'single_bloom';

interface BotanicalSpecimenProps {
  variant?: BotanicalVariant;
  className?: string;
  depth?: 'foreground' | 'midground' | 'background';
  animated?: boolean;
}

/**
 * Editorial Botanical Specimen
 * Fine-art botanical vector illustrations inspired by vintage herbarium prints and high-fashion editorial posters.
 * Features fine 1.5px–2px ink contour lines, layered translucent petal gradients, and organic botanical curvature.
 */
export const BotanicalSpecimen: React.FC<BotanicalSpecimenProps> = ({
  variant = 'tulip_stem',
  className = '',
  depth = 'midground',
  animated = true,
}) => {
  const depthFilter = {
    foreground: 'filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]',
    midground: 'opacity-90',
    background: 'opacity-40 blur-[1px]',
  }[depth];

  // 1. TULIP STEM: Curving, elegant botanical stem with closed tulip bud & leaves
  if (variant === 'tulip_stem') {
    return (
      <motion.div
        animate={
          animated
            ? {
                rotate: [-0.8, 1.2, -0.8],
                y: [0, -3, 0],
              }
            : undefined
        }
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`pointer-events-none select-none ${depthFilter} ${className}`}
      >
        <svg
          viewBox="0 0 240 380"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Outer Petal Gradient: Deep Crimson Velvet to Dusty Rose */}
            <linearGradient id="botanicalPetal1" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#d6336c" />
              <stop offset="45%" stopColor="#a61e4d" />
              <stop offset="100%" stopColor="#491223" />
            </linearGradient>

            {/* Inner Petal Highlight: Soft Blush */}
            <linearGradient id="botanicalPetal2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fcc2d7" />
              <stop offset="60%" stopColor="#e64980" />
              <stop offset="100%" stopColor="#7a1631" />
            </linearGradient>

            {/* Stem Gradient: Deep Muted Sage/Plum */}
            <linearGradient id="botanicalStem" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#49263a" />
              <stop offset="100%" stopColor="#210f1c" />
            </linearGradient>
          </defs>

          {/* S-curved Botanical Stem */}
          <path
            d="M85 140 C90 190 75 250 110 375"
            stroke="url(#botanicalStem)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Long Graceful Botanical Leaf */}
          <path
            d="M92 230 C135 220 165 170 170 130 C150 175 120 225 88 245 Z"
            fill="#2c1424"
            stroke="#5c2948"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Leaf Midrib Vein */}
          <path
            d="M92 230 Q130 185 170 130"
            stroke="#7a3660"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Second Curving Lower Leaf */}
          <path
            d="M96 280 C60 270 30 230 25 185 C40 225 70 270 98 290 Z"
            fill="#220e1c"
            stroke="#4d1f3d"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Flower Receptacle Sepal */}
          <path
            d="M75 140 C85 152 95 152 105 140 C95 146 85 146 75 140 Z"
            fill="#3b172d"
            stroke="#5c2345"
            strokeWidth="1.5"
          />

          {/* Layered Tulip Bloom */}
          {/* Back Petal Layer */}
          <path
            d="M58 85 C52 50 78 20 90 15 C102 20 128 50 122 85 C118 125 62 125 58 85 Z"
            fill="#5c1328"
            stroke="#210710"
            strokeWidth="1.5"
          />

          {/* Left Petal with Fine Creases */}
          <path
            d="M52 80 C44 42 75 15 88 18 C78 48 70 85 85 132 C65 125 54 105 52 80 Z"
            fill="url(#botanicalPetal1)"
            stroke="#2b0714"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M62 60 C65 75 70 95 78 115"
            stroke="#f783ac"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Right Petal Overlap */}
          <path
            d="M128 80 C136 42 105 15 92 18 C102 48 110 85 95 132 C115 125 126 105 128 80 Z"
            fill="url(#botanicalPetal1)"
            stroke="#2b0714"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M118 60 C115 75 110 95 102 115"
            stroke="#f783ac"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Center Petal Flare */}
          <path
            d="M72 82 C72 45 88 28 90 28 C92 28 108 45 108 82 C108 120 72 120 72 82 Z"
            fill="url(#botanicalPetal2)"
            stroke="#3b081a"
            strokeWidth="1.5"
          />
          {/* Subtle Petal Center Vein */}
          <path
            d="M90 32 V118"
            stroke="#fcc2d7"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </motion.div>
    );
  }

  // 2. CORNER SPRAY: Asymmetrical botanical framing corner
  if (variant === 'corner_spray') {
    return (
      <div className={`pointer-events-none select-none ${depthFilter} ${className}`}>
        <svg
          viewBox="0 0 300 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Branch 1 */}
          <path
            d="M0 240 C60 210 140 180 230 110"
            stroke="#3a162b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Leaflets */}
          <path
            d="M90 195 C120 180 135 155 130 140 C115 155 95 180 90 195 Z"
            fill="#2c0f20"
            stroke="#632649"
            strokeWidth="1.2"
          />
          <path
            d="M140 165 C175 155 195 130 190 115 C175 128 150 150 140 165 Z"
            fill="#2c0f20"
            stroke="#632649"
            strokeWidth="1.2"
          />
          <path
            d="M185 130 C220 120 240 95 235 80 C220 95 195 115 185 130 Z"
            fill="#381328"
            stroke="#7a305b"
            strokeWidth="1.2"
          />

          {/* Small Bud Bloom on Branch */}
          <g transform="translate(210, 70)">
            <ellipse cx="18" cy="18" rx="14" ry="20" fill="#a61e4d" stroke="#1f050e" strokeWidth="1.5" />
            <path d="M12 8 C18 16 22 28 20 36" stroke="#fcc2d7" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          </g>
        </svg>
      </div>
    );
  }

  // 3. PRESSED PETALS: Delicate drifting petals with organic contour
  return (
    <div className={`pointer-events-none select-none ${depthFilter} ${className}`}>
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          d="M38 12 C52 14 68 28 65 48 C62 64 45 72 32 68 C20 64 12 50 16 32 C20 18 28 10 38 12 Z"
          fill="#8f1d40"
          stroke="#3d0b1a"
          strokeWidth="1.5"
          opacity="0.85"
        />
        <path
          d="M36 20 C42 32 44 48 38 62"
          stroke="#f783ac"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    </div>
  );
};
