import React from 'react';
import { motion } from 'framer-motion';
import { ChibiExpression } from '../../types';

interface VectorChibiProps {
  expression: ChibiExpression;
  className?: string;
}

/**
 * Coherent Original Mascot System:
 * - Constant stroke weight (4px)
 * - Identical ink color (#160410)
 * - Identical facial proportions & soft blush (#ff7da7)
 * - Expressive animated motion rhythms (not generic floating)
 */
export const VectorChibi: React.FC<VectorChibiProps> = ({
  expression,
  className = '',
}) => {
  // Shared Ink & Blush definitions
  const inkColor = '#160410';
  const blushColor = '#ff7da7';

  switch (expression) {
    // 1. IDLE: Calm, shy, holding crimson rose with slow subtle breathing
    case 'rose':
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{
            opacity: 1,
            scale: [1, 1.015, 1],
            y: [0, -3, 0],
          }}
          transition={{
            opacity: { duration: 0.8 },
            scale: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
          }}
          className={`relative flex items-center justify-center select-none ${className}`}
        >
          <div className="relative w-44 h-48 sm:w-52 sm:h-56 md:w-60 md:h-64">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_4px_25px_rgba(255,42,133,0.35)]"
            >
              <defs>
                <linearGradient id="rosePetal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff2a6d" />
                  <stop offset="60%" stopColor="#c70039" />
                  <stop offset="100%" stopColor="#660017" />
                </linearGradient>
              </defs>

              {/* Bean Body */}
              <path
                d="M78 120 C68 140 70 175 100 175 C130 175 132 140 122 120 Z"
                fill="#ffffff"
                stroke={inkColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Left arm resting shyly */}
              <path d="M78 128 Q70 142 68 150" stroke={inkColor} strokeWidth="4" strokeLinecap="round" />

              {/* Head */}
              <circle cx="100" cy="80" r="44" fill="#ffffff" stroke={inkColor} strokeWidth="4" />

              {/* Confident / Shy Eyebrows */}
              <path d="M78 58 Q86 52 92 60" stroke={inkColor} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M108 60 Q114 54 122 59" stroke={inkColor} strokeWidth="3.5" strokeLinecap="round" />

              {/* Signature Expressive Eyes */}
              <g transform="translate(80, 72)">
                <ellipse cx="6" cy="8" rx="6.5" ry="8.5" fill={inkColor} />
                <circle cx="4" cy="5" r="2.5" fill="#ffffff" />
                <circle cx="8" cy="11" r="1.2" fill="#ffffff" />
              </g>
              <g transform="translate(112, 72)">
                <ellipse cx="6" cy="8" rx="6.5" ry="8.5" fill={inkColor} />
                <circle cx="4" cy="5" r="2.5" fill="#ffffff" />
                <circle cx="8" cy="11" r="1.2" fill="#ffffff" />
              </g>

              {/* Soft Signature Blush */}
              <ellipse cx="76" cy="90" rx="8" ry="5" fill={blushColor} opacity="0.65" />
              <ellipse cx="124" cy="90" rx="8" ry="5" fill={blushColor} opacity="0.65" />

              {/* Shy subtle smirk mouth */}
              <path d="M96 95 Q102 102 110 95" stroke={inkColor} strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Right Arm presenting single rose */}
              <path d="M120 120 C136 112 146 98 152 92" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
              <path d="M120 120 C136 112 146 98 152 92" stroke={inkColor} strokeWidth="4" strokeLinecap="round" />

              {/* Rose Stem */}
              <path d="M152 92 L156 132" stroke="#255932" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M154 108 Q146 104 144 110" stroke="#255932" strokeWidth="2.5" strokeLinecap="round" />

              {/* Rose Blossom */}
              <g transform="translate(142, 62)">
                <ellipse cx="16" cy="18" rx="16" ry="15" fill="url(#rosePetal)" stroke="#4a0212" strokeWidth="2" />
                <circle cx="16" cy="17" r="8" fill="#8f0022" />
                <path d="M12 15 Q16 11 20 15 Q16 20 12 15" stroke="#ff85a1" strokeWidth="2" fill="none" />
              </g>
            </svg>
          </div>
        </motion.div>
      );

    // 2. REACH / PANICKED: Fast anticipation, lunging forward with kinetic reach
    case 'reach':
      return (
        <motion.div
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`relative flex items-center justify-center select-none ${className}`}
        >
          <div className="relative w-56 h-48 sm:w-64 sm:h-52 md:w-72 md:h-60">
            <svg
              viewBox="0 0 220 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_4px_25px_rgba(255,42,133,0.4)]"
            >
              {/* Dynamic Speedlines */}
              <path d="M15 95 L50 90 M20 115 L55 110" stroke="#ff7da7" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

              {/* Lunging Bean Body */}
              <path
                d="M65 145 C70 115 100 105 130 112 C150 118 160 140 162 152 Z"
                fill="#ffffff"
                stroke={inkColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Trailing leg */}
              <path d="M72 144 C50 152 35 156 22 152" stroke={inkColor} strokeWidth="4.5" strokeLinecap="round" />

              {/* Head angled forward */}
              <circle cx="132" cy="74" r="44" fill="#ffffff" stroke={inkColor} strokeWidth="4" />

              {/* Panicked Open Eyes */}
              <g transform="translate(122, 64)">
                <ellipse cx="7" cy="9" rx="8" ry="10" fill={inkColor} />
                <circle cx="5" cy="6" r="3" fill="#ffffff" />
              </g>
              <g transform="translate(152, 62)">
                <ellipse cx="7" cy="9" rx="8" ry="10" fill={inkColor} />
                <circle cx="5" cy="6" r="3" fill="#ffffff" />
              </g>

              {/* Cheeks */}
              <ellipse cx="118" cy="84" rx="8" ry="5" fill={blushColor} opacity="0.7" />
              <ellipse cx="166" cy="82" rx="8" ry="5" fill={blushColor} opacity="0.7" />

              {/* Gasping open mouth */}
              <path d="M136 90 Q146 100 154 89" stroke={inkColor} strokeWidth="3" fill="#ff7da7" strokeLinecap="round" />

              {/* Outstretched arms */}
              <path d="M120 98 C150 88 180 82 202 78" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
              <path d="M120 98 C150 88 180 82 202 78" stroke={inkColor} strokeWidth="4" strokeLinecap="round" />
              <circle cx="204" cy="77" r="5" fill="#ffffff" stroke={inkColor} strokeWidth="3" />
              <circle cx="202" cy="70" r="4" fill="#ffffff" stroke={inkColor} strokeWidth="3" />
              <circle cx="202" cy="84" r="4" fill="#ffffff" stroke={inkColor} strokeWidth="3" />
            </svg>
          </div>
        </motion.div>
      );

    // 3. HEARTBROKEN: Quiet collapse on ground, animated teardrop ripples
    case 'floor_cry':
      return (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`relative flex items-center justify-center select-none ${className}`}
        >
          <div className="relative w-56 h-40 sm:w-64 sm:h-44 md:w-72 md:h-48">
            <svg
              viewBox="0 0 220 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_4px_25px_rgba(255,42,133,0.35)]"
            >
              {/* Tear ripple puddle */}
              <ellipse cx="65" cy="128" rx="36" ry="11" fill="none" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.55" />
              <ellipse cx="65" cy="128" rx="20" ry="7" fill="#7dd3fc" opacity="0.25" />

              {/* Collapsed body */}
              <path
                d="M52 112 C58 84 96 82 142 90 C172 96 182 115 178 128 C152 134 70 134 52 112 Z"
                fill="#ffffff"
                stroke={inkColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Head softly down */}
              <ellipse cx="80" cy="94" rx="44" ry="38" fill="#ffffff" stroke={inkColor} strokeWidth="4" />

              {/* Closed crying crescent eyes */}
              <path d="M56 88 Q66 98 76 88" stroke={inkColor} strokeWidth="3.5" strokeLinecap="round" />
              <path d="M86 88 Q96 98 106 88" stroke={inkColor} strokeWidth="3.5" strokeLinecap="round" />

              {/* Delicate animated teardrop streams */}
              <path d="M66 94 C64 106 62 118 64 126" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
              <path d="M96 94 C98 106 100 118 98 126" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />

              {/* Blush */}
              <ellipse cx="54" cy="98" rx="7" ry="4" fill={blushColor} opacity="0.6" />
              <ellipse cx="108" cy="98" rx="7" ry="4" fill={blushColor} opacity="0.6" />
            </svg>
          </div>
        </motion.div>
      );

    // 4. PLEADING / PUPPY EYES: Same face design, large glossy expectant eyes
    case 'puppy_eyes':
    case 'sign_plead':
      return (
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          className={`relative flex items-center justify-center select-none ${className}`}
        >
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_4px_25px_rgba(255,42,133,0.4)]"
            >
              {/* Head */}
              <circle cx="100" cy="78" r="44" fill="#ffffff" stroke={inkColor} strokeWidth="4" />

              {/* Soft Pleading Eyebrows */}
              <path d="M74 56 Q84 50 92 58" stroke={inkColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M108 58 Q116 50 126 56" stroke={inkColor} strokeWidth="3" strokeLinecap="round" />

              {/* Large Glistening Puppy Eyes (Consistent mascot eyes) */}
              <g transform="translate(74, 66)">
                <ellipse cx="11" cy="14" rx="11" ry="14" fill={inkColor} />
                <circle cx="7" cy="9" r="4" fill="#ffffff" />
                <circle cx="14" cy="17" r="2" fill="#ffffff" />
                <circle cx="8" cy="17" r="1.5" fill="#ff7da7" opacity="0.85" />
              </g>
              <g transform="translate(104, 66)">
                <ellipse cx="11" cy="14" rx="11" ry="14" fill={inkColor} />
                <circle cx="7" cy="9" r="4" fill="#ffffff" />
                <circle cx="14" cy="17" r="2" fill="#ffffff" />
                <circle cx="8" cy="17" r="1.5" fill="#ff7da7" opacity="0.85" />
              </g>

              {/* Blush */}
              <ellipse cx="72" cy="94" rx="9" ry="5" fill={blushColor} opacity="0.75" />
              <ellipse cx="128" cy="94" rx="9" ry="5" fill={blushColor} opacity="0.75" />

              {/* Small shy mouth */}
              <path d="M96 98 Q100 104 104 98" stroke={inkColor} strokeWidth="3" fill="none" strokeLinecap="round" />

              {/* Body & Clasped Hands */}
              <path d="M78 120 C72 145 76 172 100 172 C124 172 128 145 122 120 Z" fill="#ffffff" stroke={inkColor} strokeWidth="4" />
              <ellipse cx="100" cy="138" rx="10" ry="8" fill="#ffffff" stroke={inkColor} strokeWidth="3.5" />
            </svg>
          </div>
        </motion.div>
      );

    // 5. CELEBRATION: Upward jump, blissfully closed eyes, hugging big beating heart
    case 'hug_heart':
      return (
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            y: [0, -6, 0],
          }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className={`relative flex items-center justify-center select-none ${className}`}
        >
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72">
            <svg
              viewBox="0 0 220 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full filter drop-shadow-[0_4px_35px_rgba(255,42,133,0.55)]"
            >
              <defs>
                <linearGradient id="celebHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff4d94" />
                  <stop offset="50%" stopColor="#ff1475" />
                  <stop offset="100%" stopColor="#990038" />
                </linearGradient>
              </defs>

              {/* Head leaning over heart */}
              <circle cx="105" cy="74" r="44" fill="#ffffff" stroke={inkColor} strokeWidth="4" />

              {/* Blissfully curved closed eyes */}
              <path d="M84 72 Q94 62 104 72" stroke={inkColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M114 72 Q124 62 134 72" stroke={inkColor} strokeWidth="4" strokeLinecap="round" />

              {/* Radiant Warm Blush */}
              <ellipse cx="82" cy="84" rx="10" ry="6" fill={blushColor} opacity="0.85" />
              <ellipse cx="136" cy="84" rx="10" ry="6" fill={blushColor} opacity="0.85" />

              {/* Huge joyful smile */}
              <path d="M102 86 Q110 96 118 86" stroke={inkColor} strokeWidth="3.5" strokeLinecap="round" fill="#ff7da7" />

              {/* Giant Beating Heart */}
              <path
                d="M110 96 C98 68 55 68 55 106 C55 146 110 180 110 180 C110 180 165 146 165 106 C165 68 122 68 110 96 Z"
                fill="url(#celebHeart)"
                stroke="#ff85b3"
                strokeWidth="3.5"
              />

              {/* Arms tightly wrapping around heart */}
              <path d="M68 98 C50 110 52 132 72 140" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" />
              <path d="M68 98 C50 110 52 132 72 140" stroke={inkColor} strokeWidth="4" strokeLinecap="round" />

              <path d="M152 98 C170 110 168 132 148 140" stroke="#ffffff" strokeWidth="13" strokeLinecap="round" />
              <path d="M152 98 C170 110 168 132 148 140" stroke={inkColor} strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>
      );

    default:
      return null;
  }
};
