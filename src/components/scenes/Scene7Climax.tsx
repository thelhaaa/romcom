import React from 'react';
import { motion } from 'framer-motion';
import { LayeredMascot } from '../character/LayeredMascot';
import { GlowPillButton } from '../ui/GlowPillButton';
import { HolographicSticker } from '../effects/HolographicSticker';
import { WashiTape } from '../ui/WashiTape';
import { AppleEmoji } from '../ui/AppleEmoji';

interface Scene7ClimaxProps {
  onYes: () => void;
}

export const Scene7Climax: React.FC<Scene7ClimaxProps> = ({ onYes }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center select-none"
    >
      <div className="relative mb-3 flex items-center justify-center">
        <WashiTape variant="gold" rotation={-5} width="w-28" className="absolute -top-3 left-4 pointer-events-none" />
        <HolographicSticker rotation={-2} variant="gold">
          <span className="font-monoTag text-xs text-[#fef08a] uppercase font-bold tracking-widest flex items-center gap-1.5">
            <span>✦ [FINAL_DESTINY: UNCONDITIONAL]</span>
            <AppleEmoji emoji="🌹" className="w-4 h-4 inline-block" />
          </span>
        </HolographicSticker>
      </div>

      <motion.p
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="font-apple font-semibold text-xl sm:text-2xl text-roseGlow mb-2 flex items-center justify-center gap-2"
      >
        <span>“Okay... I'll ask one last time”</span>
        <AppleEmoji emoji="🥺" className="w-6 h-6 inline-block" />
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="leading-[0.88] tracking-tight mb-3"
      >
        <span className="font-apple font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] uppercase text-silkWhite drop-shadow-[0_4px_35px_rgba(255,255,255,0.35)] block">
          WILL YOU
        </span>
        <span className="font-curvy italic font-bold text-6xl sm:text-7xl md:text-8xl lg:text-[6rem] bg-gradient-to-r from-[#ff4d88] via-[#ff7da7] to-[#fcc2d7] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,77,136,0.7)] block mt-1 animate-heartbeat">
          BE MINE?
        </span>
      </motion.h1>

      <div className="my-1.5">
        <LayeredMascot pose="rose" />
      </div>

      <p className="font-monoTag text-xs tracking-widest uppercase text-balletPink/70 mb-5 flex items-center justify-center gap-1.5">
        <span>[ THERE IS ONLY ONE TRUE ANSWER ]</span>
        <AppleEmoji emoji="💖" className="w-3.5 h-3.5 inline-block" />
      </p>

      {/* The Inevitable Dual-YES Destiny Trap */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md">
        <GlowPillButton
          variant="yes"
          size="xl"
          onClick={onYes}
          className="w-full"
          isPulsing={true}
        >
          Yes
        </GlowPillButton>

        <GlowPillButton
          variant="yes"
          size="xl"
          onClick={onYes}
          className="w-full"
          isPulsing={true}
        >
          Of course, Yes
        </GlowPillButton>
      </div>
    </motion.div>
  );
};
