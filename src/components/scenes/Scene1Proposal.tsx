import React from 'react';
import { motion } from 'framer-motion';
import { LayeredMascot } from '../character/LayeredMascot';
import { GlowPillButton } from '../ui/GlowPillButton';
import { BotanicalSpecimen } from '../stage/BotanicalSpecimen';
import { SatinRibbon } from '../stage/SatinRibbon';

interface Scene1ProposalProps {
  onYes: () => void;
  onNo: () => void;
}

/**
 * Scene 1: The Main Proposal
 * High-fashion botanical editorial poster layout.
 * Combines oversized Cormorant Garamond typography, hand-drawn layered mascot presenting a crimson rose,
 * physical satin ribbon drape, and fine botanical specimen framing.
 */
export const Scene1Proposal: React.FC<Scene1ProposalProps> = ({
  onYes,
  onNo,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-5xl mx-auto flex flex-col select-none py-6 sm:py-10 px-4 sm:px-8"
    >
      {/* 1. Hanging Satin Ribbon Drape (Top Right Corner Motif) */}
      <div className="absolute -top-4 right-2 sm:right-6 w-28 sm:w-36 h-auto pointer-events-none z-30 opacity-85">
        <SatinRibbon placement="hanging_drape" />
      </div>

      {/* 2. Foreground Botanical Tulip Specimen (Bottom Left Corner) */}
      <div className="absolute -bottom-8 -left-6 sm:-left-12 w-36 sm:w-52 h-auto pointer-events-none z-30">
        <BotanicalSpecimen variant="tulip_stem" depth="foreground" />
      </div>

      {/* 3. Editorial Metadata Header */}
      <div className="w-full flex items-center justify-between border-b border-[#2b1020] pb-3 mb-8">
        <span className="font-sans text-[11px] tracking-[0.25em] text-[#d4708f]/80 uppercase font-medium">
          [ CHAPTER 01 / THE QUESTION ]
        </span>
        <span className="font-script text-lg sm:text-xl text-[#f5c2d3]/80">
          for you, always ♡
        </span>
      </div>

      {/* 4. Asymmetrical Poster Composition: Typography & Mascot */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-20">
        {/* Left Column (Editorial Typography & Call to Action) */}
        <motion.div
          initial={{ x: -25, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left"
        >
          {/* Handwritten Whisper */}
          <span className="font-script text-2xl sm:text-3xl text-[#d4708f] rotate-[-2deg] inline-block mb-1">
            a tiny question for your heart...
          </span>

          {/* Monumental Headline */}
          <h1 className="font-serif font-light text-5xl sm:text-7xl md:text-8xl lg:text-[5.75rem] text-[#fcf8f9] leading-[0.92] tracking-tight mb-6">
            WILL YOU <br />
            <span className="italic font-normal text-[#ff7da7]">BE MINE?</span>
          </h1>

          <p className="font-serif italic text-base sm:text-lg text-[#f5c2d3]/80 max-w-md mb-8 leading-relaxed">
            “In a world full of fleeting moments, I find myself holding onto every second with you.”
          </p>

          {/* Interactive Editorial Action Buttons */}
          <div className="flex items-center gap-5 sm:gap-6">
            <GlowPillButton variant="yes" size="lg" onClick={onYes}>
              Yes
            </GlowPillButton>

            <GlowPillButton variant="no" size="md" onClick={onNo}>
              No
            </GlowPillButton>
          </div>
        </motion.div>

        {/* Right Column (Layered Mascot Presentation) */}
        <motion.div
          initial={{ x: 25, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-5 flex flex-col items-center justify-center relative py-4"
        >
          {/* Subtle Ambient Backing Glow behind Character */}
          <div className="absolute inset-0 bg-radial from-[#ff2a85]/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Character Rig with Rose */}
          <LayeredMascot pose="rose" />

          {/* Small Handwritten Footnote */}
          <span className="font-script text-base text-[#d4708f]/70 mt-3 rotate-[1.5deg]">
            (with all my love)
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};
