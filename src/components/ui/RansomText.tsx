import React from 'react';
import { motion } from 'framer-motion';
import { sound } from '../../utils/audioEngine';

interface RansomTextProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant';
  interactive?: boolean;
}

interface LetterStyle {
  bg: string;
  text: string;
  border: string;
  font: string;
  rot: number;
  texture?: string;
  caseTransform?: 'uppercase' | 'lowercase' | 'capitalize';
}

const PALETTES: LetterStyle[] = [
  {
    bg: 'bg-[#faf5ec]',
    text: 'text-[#181316]',
    border: 'border border-[#dcd1c0] shadow-[2px_3px_8px_rgba(0,0,0,0.45)]',
    font: 'font-poster font-black',
    rot: -3.5,
  },
  {
    bg: 'bg-[#1a141b]',
    text: 'text-[#fff8f0]',
    border: 'border border-white/30 shadow-[3px_4px_10px_rgba(0,0,0,0.6)]',
    font: 'font-curvy font-extrabold',
    rot: 4.2,
  },
  {
    bg: 'bg-[#ff7aa2]',
    text: 'text-[#2a0618]',
    border: 'border border-[#ff4785]/40 shadow-[2px_4px_8px_rgba(255,122,162,0.35)]',
    font: 'font-curvy italic font-bold',
    rot: -2,
  },
  {
    bg: 'bg-[#ffd23f]',
    text: 'text-[#1e1300]',
    border: 'border border-[#e5b800] shadow-[2px_4px_8px_rgba(0,0,0,0.4)]',
    font: 'font-poster font-extrabold',
    rot: 5,
  },
  {
    bg: 'bg-[#38bdf8]',
    text: 'text-[#041a2f]',
    border: 'border border-[#0ea5e9]/40 shadow-[2px_4px_8px_rgba(56,189,248,0.35)]',
    font: 'font-monoTag font-bold',
    rot: -4.5,
  },
  {
    bg: 'bg-[#e2c7a4]',
    text: 'text-[#26150b]',
    border: 'border border-[#c29f76] shadow-[2px_3px_7px_rgba(0,0,0,0.45)]',
    font: 'font-editorial italic font-black',
    rot: 3,
  },
  {
    bg: 'bg-[#e63946]',
    text: 'text-[#ffffff]',
    border: 'border border-white/40 shadow-[2px_4px_10px_rgba(230,57,70,0.45)]',
    font: 'font-poster font-black',
    rot: -5,
  },
  {
    bg: 'bg-[#c084fc]',
    text: 'text-[#1c0836]',
    border: 'border border-[#a855f7]/40 shadow-[2px_4px_8px_rgba(192,132,252,0.35)]',
    font: 'font-curvy font-black',
    rot: 2.5,
  },
];

export const RansomText: React.FC<RansomTextProps> = ({
  text,
  className = '',
  size = 'lg',
  interactive = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 min-w-[20px] m-0.5 rounded-[2px]',
    md: 'text-sm sm:text-base px-2 py-1 min-w-[26px] m-0.5 sm:m-1 rounded-[3px]',
    lg: 'text-xl sm:text-3xl md:text-4xl px-2.5 sm:px-3 py-1 sm:py-1.5 min-w-[34px] sm:min-w-[42px] m-1 rounded-[4px]',
    xl: 'text-2xl sm:text-4xl md:text-5xl px-3 sm:px-4 py-1.5 sm:py-2 min-w-[42px] sm:min-w-[54px] m-1 sm:m-1.5 rounded-[5px]',
    giant: 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl px-3.5 sm:px-5 py-2 sm:py-3 min-w-[50px] sm:min-w-[70px] m-1 sm:m-2 rounded-[6px]',
  }[size];

  // Split words to preserve spaces
  const words = text.split(' ');

  let globalCharIndex = 0;

  return (
    <span className={`inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 select-none ${className}`}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex items-center">
          {word.split('').map((char, charIdx) => {
            const palette = PALETTES[globalCharIndex % PALETTES.length];
            globalCharIndex++;

            return (
              <motion.span
                key={charIdx}
                whileHover={
                  interactive
                    ? {
                        scale: 1.25,
                        rotate: palette.rot > 0 ? palette.rot + 8 : palette.rot - 8,
                        y: -6,
                        zIndex: 40,
                        transition: { type: 'spring', stiffness: 450, damping: 14 },
                      }
                    : undefined
                }
                whileTap={interactive ? { scale: 0.9 } : undefined}
                onMouseEnter={() => {
                  if (interactive) sound.playPop();
                }}
                style={{
                  transform: `rotate(${palette.rot}deg)`,
                  transformOrigin: 'center center',
                }}
                className={`inline-block text-center leading-none tracking-normal cursor-pointer transition-shadow ${sizeClasses} ${palette.bg} ${palette.text} ${palette.border} ${palette.font}`}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
};
