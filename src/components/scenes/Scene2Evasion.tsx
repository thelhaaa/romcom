import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayeredMascot } from '../character/LayeredMascot';
import { GlowPillButton } from '../ui/GlowPillButton';
import { BotanicalSpecimen } from '../stage/BotanicalSpecimen';
import { useButtonEvasion } from '../../hooks/useButtonEvasion';

interface Scene2EvasionProps {
  onYes: () => void;
  onCatch: () => void;
}

/**
 * Scene 2: First Escalation (The Evasion)
 * Character-led motion choreography:
 * Anticipation -> Lunge reaction -> Button spring dodge -> Settle
 */
export const Scene2Evasion: React.FC<Scene2EvasionProps> = ({
  onYes,
  onCatch,
}) => {
  const { position, dodge, dodgeCount } = useButtonEvasion(200, 90);
  const [isAnticipating, setIsAnticipating] = useState(false);

  const handlePointerApproach = () => {
    setIsAnticipating(true);
    setTimeout(() => {
      dodge();
      setIsAnticipating(false);
    }, 90);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none py-6 sm:py-10 px-4 sm:px-8 text-center"
    >
      {/* 1. Background Botanical Framing */}
      <div className="absolute top-0 -left-8 sm:-left-16 w-36 sm:w-48 h-auto pointer-events-none opacity-40 z-10">
        <BotanicalSpecimen variant="corner_spray" depth="background" />
      </div>

      {/* 2. Editorial Metadata */}
      <div className="w-full flex items-center justify-between border-b border-[#2b1020] pb-3 mb-6">
        <span className="font-sans text-[11px] tracking-[0.25em] text-[#d4708f]/80 uppercase font-medium">
          [ CHAPTER 02 / FIRST ATTEMPT ]
        </span>
        <span className="font-script text-lg sm:text-xl text-[#f5c2d3]/80">
          dodges: {dodgeCount} ♡
        </span>
      </div>

      {/* 3. Character-Led Headline */}
      <motion.div
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-4"
      >
        <h2 className="font-serif italic font-light text-4xl sm:text-6xl md:text-7xl text-[#fcf8f9] tracking-tight leading-tight">
          Hey... don't run away.
        </h2>
        <p className="font-script text-xl sm:text-2xl text-[#d4708f] mt-1">
          are you sure you want to click that?
        </p>
      </motion.div>

      {/* 4. Choreographed Mascot (Lunging Forward with Wind-up) */}
      <div className="my-2 relative z-20">
        <LayeredMascot pose="lunge" isAnticipating={isAnticipating} />
      </div>

      {/* 5. Interactive Evasion Arena with Spring Physics */}
      <div className="relative w-full max-w-lg h-44 sm:h-48 flex items-center justify-center mt-2 z-30">
        {/* Anchor YES Button */}
        <GlowPillButton variant="yes" size="lg" onClick={onYes}>
          Yes
        </GlowPillButton>

        {/* Fleeing NO button with Spring Dynamics */}
        <motion.div
          animate={{ x: position.x, y: position.y }}
          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
          onMouseEnter={handlePointerApproach}
          onTouchStart={handlePointerApproach}
          onClick={onCatch}
          className="absolute z-40 cursor-pointer"
        >
          {/* Handwritten Evasion Whisper Flag */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-7 -right-4 bg-[#faf6f0] text-[#7a1631] border border-[#ebd8c5] font-script text-sm px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap"
          >
            not so fast ♡
          </motion.div>

          <GlowPillButton variant="no" size="md">
            No
          </GlowPillButton>
        </motion.div>
      </div>
    </motion.div>
  );
};
