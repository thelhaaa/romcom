import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SatinRibbon } from '../stage/SatinRibbon';
import { BotanicalSpecimen } from '../stage/BotanicalSpecimen';
import { sound } from '../../utils/audioEngine';

interface Scene0IntroProps {
  onComplete: () => void;
}

/**
 * Scene 0: The Cold Open
 * Editorial luxury intro with draped satin ribbon, layered botanical specimen, and filmic title typography.
 */
export const Scene0Intro: React.FC<Scene0IntroProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            sound.playPop();
            onComplete();
          }, 400);
          return 100;
        }
        const step = Math.floor(Math.random() * 9) + 4;
        return Math.min(prev + step, 100);
      });
    }, 110);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center px-6 py-12 select-none"
    >
      {/* 1. Subtle Editorial Chapter Metadata */}
      <div className="absolute top-0 left-4 sm:left-0 flex items-center gap-2 font-sans text-[10px] tracking-[0.25em] text-[#d4708f]/60 uppercase">
        <span>✦</span>
        <span>Specimen 00 / A Quiet Prologue</span>
      </div>

      {/* 2. Draped Satin Ribbon Motif (Top-Right Offset, Not Centered Balloon) */}
      <div className="relative mb-8 w-32 h-44 sm:w-36 sm:h-48">
        <SatinRibbon placement="hanging_drape" />
      </div>

      {/* 3. Layered Editorial Botanical Framing (Bottom-Right Botanical Tulip Stem) */}
      <div className="absolute -bottom-10 -right-8 sm:-right-16 w-32 sm:w-44 h-auto pointer-events-none opacity-60">
        <BotanicalSpecimen variant="tulip_stem" depth="background" />
      </div>

      {/* 4. Foreground Drifting Pressed Petal */}
      <div className="absolute top-12 -left-6 sm:-left-12 w-10 h-10 pointer-events-none opacity-70 rotate-[-20deg]">
        <BotanicalSpecimen variant="pressed_petals" depth="foreground" />
      </div>

      {/* 5. Editorial Typography */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.85 }}
        className="mb-8"
      >
        <h2 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl text-[#fcf8f9] tracking-tight leading-tight mb-2">
          A Quiet Moment For You
        </h2>
        <p className="font-script text-xl sm:text-2xl text-[#d4708f] tracking-wide">
          take a breath... ♡
        </p>
      </motion.div>

      {/* 6. Hairline Filmic Progress Bar */}
      <div className="w-full max-w-sm h-1 rounded-full bg-[#1b0814] border border-[#3b1227] p-0 relative overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#8f1d40] via-[#d6336c] to-[#f5c2d3] rounded-full transition-all duration-150 relative"
          style={{ width: `${progress}%` }}
        >
          {/* Luminous micro leading dot */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
        </div>
      </div>

      {/* 7. Editorial Counter & Micro Hint */}
      <div className="mt-3.5 flex items-center justify-between w-full max-w-sm px-1 font-sans text-xs">
        <span className="text-[10px] tracking-[0.2em] text-[#d4708f]/70 uppercase font-medium">
          Preparing The Story
        </span>
        <span className="font-serif italic text-sm text-[#fcf8f9]/90 tracking-wider">
          {progress}%
        </span>
      </div>
    </motion.div>
  );
};
