import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayeredMascot } from '../character/LayeredMascot';
import { GlowPillButton } from '../ui/GlowPillButton';
import { HolographicSticker } from '../effects/HolographicSticker';
import { WashiTape } from '../ui/WashiTape';
import { AppleEmoji } from '../ui/AppleEmoji';

interface Scene4RetroModalProps {
  onYes: () => void;
  onNo: () => void;
}

export const Scene4RetroModal: React.FC<Scene4RetroModalProps> = ({
  onYes,
  onNo,
}) => {
  const [buttonHover, setButtonHover] = useState<'none' | 'yes' | 'no'>('none');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 w-full max-w-sm sm:max-w-md bg-gradient-to-b from-[#21091a]/95 via-[#160511]/95 to-[#0d020a]/95 backdrop-blur-xl border-2 border-pink-400/35 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(255,42,133,0.25)] select-none text-center flex flex-col items-center"
    >
      {/* Top Washi Tape */}
      <div className="absolute -top-3 left-6 pointer-events-none z-30">
        <WashiTape variant="grid" rotation={-6} width="w-24" />
      </div>

      {/* Holographic System Sticker Badge */}
      <div className="mb-3">
        <HolographicSticker rotation={-2} variant="chrome">
          <span className="font-monoTag text-[11px] text-[#e2e8f0] tracking-wider uppercase font-semibold flex items-center gap-1.5">
            <span>[SYS_ALERT: HEART_DETECTED]</span>
            <AppleEmoji emoji="💖" className="w-3.5 h-3.5 inline-block" />
          </span>
        </HolographicSticker>
      </div>

      <h3 className="font-apple font-black text-3xl sm:text-4xl text-silkWhite uppercase tracking-tight drop-shadow-[0_2px_15px_rgba(255,255,255,0.3)] mb-1">
        THINK AGAIN...
      </h3>

      <p className="font-curvy italic font-normal text-2xl sm:text-3xl text-roseGlow drop-shadow-[0_0_15px_rgba(255,125,167,0.5)] mb-1">
        Look into these puppy eyes...
      </p>

      <p className="font-apple text-sm sm:text-base text-[#fbcfe8]/90 mb-3 flex items-center justify-center gap-1">
        <span>how could you say no to this face?</span>
        <AppleEmoji emoji="🥺" className="w-4 h-4 inline-block" />
      </p>

      {/* Peeking Puppy Eyes Mascot */}
      <div className="my-2 p-3 bg-white/[0.03] rounded-2xl border border-white/10">
        <LayeredMascot pose="puppy_eyes" buttonHover={buttonHover} />
      </div>

      {/* Interactive Options with Gaze Reaction */}
      <div className="flex items-center justify-center gap-4 mt-4 w-full">
        <div
          onMouseEnter={() => setButtonHover('yes')}
          onMouseLeave={() => setButtonHover('none')}
          className="flex-1"
        >
          <GlowPillButton variant="yes" size="md" onClick={onYes} className="w-full">
            Yes
          </GlowPillButton>
        </div>
        <div
          onMouseEnter={() => setButtonHover('no')}
          onMouseLeave={() => setButtonHover('none')}
          className="flex-1"
        >
          <GlowPillButton variant="no" size="md" onClick={onNo} className="w-full">
            No
          </GlowPillButton>
        </div>
      </div>
    </motion.div>
  );
};
