import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayeredMascot } from '../character/LayeredMascot';
import { GlowPillButton } from '../ui/GlowPillButton';
import { HolographicSticker } from '../effects/HolographicSticker';
import { WashiTape } from '../ui/WashiTape';
import { AppleEmoji } from '../ui/AppleEmoji';
import { sound } from '../../utils/audioEngine';

interface Scene6VowsProps {
  onYes: () => void;
  onNo: () => void;
}

export const Scene6Vows: React.FC<Scene6VowsProps> = ({ onYes, onNo }) => {
  const [setIdx, setSetIdx] = useState(0);
  const [buttonHover, setButtonHover] = useState<'none' | 'yes' | 'no'>('none');

  const vowSets = [
    [
      "I will always be your safe haven to rest",
      "I will celebrate every tiny win of yours",
      "I'll bring you warm tea and your favorite sweets",
      "I'll listen whenever the world feels too loud",
      "I'll choose you, quietly and fiercely, every day",
    ],
    [
      "Warm morning coffee and forehead kisses",
      "Spontaneous late-night drives to nowhere",
      "Holding your hand when life feels uncertain",
      "Laughing until our stomachs hurt at silly things",
      "Building a life filled with tenderness and peace",
    ],
    [
      "Being your biggest cheerleader through everything",
      "Always saving the best bite of food for you",
      "Never letting you feel alone in this big world",
      "Soft blankets, movie marathons, and quiet cuddles",
      "Loving you more deeply with every passing season",
    ],
  ];

  const currentVows = vowSets[setIdx % vowSets.length];

  const handleShuffle = () => {
    sound.playPop();
    setSetIdx((prev) => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center w-full max-w-xl mx-auto text-center select-none"
    >
      {/* 1. Authentic Tactile Cardboard Scrapbook Keepsake */}
      <motion.div
        initial={{ y: 15, rotateX: -8 }}
        animate={{ y: 0, rotateX: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full bg-gradient-to-b from-[#21091a]/95 via-[#180713]/95 to-[#0e030b]/98 border-2 border-[#ff7da7]/35 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(255,42,133,0.25)] mb-4 overflow-visible"
        style={{ perspective: 1000 }}
      >
        {/* Top-Left Washi Tape Pinning the Cardboard */}
        <div className="absolute -top-3 left-6 z-30 pointer-events-none">
          <WashiTape variant="gold" rotation={-7} width="w-24 sm:w-28" />
        </div>

        {/* Top-Right Holographic Archive Sticker (Positioned safely with clear margin) */}
        <div className="absolute -top-3 right-5 sm:right-7 z-30">
          <HolographicSticker rotation={3} variant="gold">
            <span className="font-monoTag text-[10px] text-[#fef08a] uppercase font-bold tracking-wider flex items-center gap-1">
              <span>[VOWS_ARCHIVE: SEALED]</span>
              <AppleEmoji emoji="💌" className="w-3.5 h-3.5 inline-block" />
            </span>
          </HolographicSticker>
        </div>

        {/* Card Header with Clean Apple Tag & Curvy Serif */}
        <div className="mt-2 mb-3 pt-2">
          <span className="font-apple font-bold text-xs uppercase tracking-[0.25em] text-[#ff7da7] mb-1 block">
            [ A SACRED ARCHIVE FOR YOU ]
          </span>
          <h3 className="font-curvy italic font-bold text-2xl sm:text-3xl text-silkWhite drop-shadow-[0_0_15px_rgba(255,125,167,0.5)]">
            A few gentle promises ♡
          </h3>
        </div>

        {/* The List of Vows Promises */}
        <div className="space-y-2.5 text-left my-3">
          {currentVows.map((vow, i) => (
            <motion.div
              key={i}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 backdrop-blur-sm transition-colors"
            >
              <AppleEmoji emoji="💖" className="w-4 h-4 flex-shrink-0 inline-block" />
              <span className="font-curvy italic text-base sm:text-lg leading-snug text-silkWhite/95">
                {vow}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Shuffle Button */}
        <button
          onClick={handleShuffle}
          className="font-apple font-semibold text-xs tracking-wider uppercase text-roseGlow hover:text-white underline underline-offset-4 mt-1 transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
        >
          <span>shuffle more promises</span>
          <AppleEmoji emoji="✨" className="w-3.5 h-3.5 inline-block" />
        </button>

        {/* 2. THE MASCOT HOLDING "PRETTY PLEASE?" EMBEDDED DIRECTLY INSIDE THE CARDBOARD */}
        <div className="relative mt-4 pt-3 border-t border-pink-500/20 flex flex-col items-center justify-center bg-black/30 rounded-2xl p-2.5">
          {/* Decorative Corner Washi Tape holding the mascot sketch */}
          <div className="absolute -top-3 left-4 pointer-events-none">
            <WashiTape variant="pink" rotation={5} width="w-20" />
          </div>

          <LayeredMascot pose="sign_plead" buttonHover={buttonHover} />

          <p className="font-apple font-medium text-xs text-[#fbcfe8]/80 mt-1 flex items-center gap-1">
            <span>pretty please... say yes</span>
            <AppleEmoji emoji="🥺" className="w-3.5 h-3.5 inline-block" />
          </p>
        </div>
      </motion.div>

      {/* 3. Luxury Buttons in Montserrat / SF Pro */}
      <div className="flex items-center justify-center gap-4 w-full max-w-md">
        <div
          onMouseEnter={() => setButtonHover('yes')}
          onMouseLeave={() => setButtonHover('none')}
          className="flex-1"
        >
          <GlowPillButton
            variant="yes"
            size="xl"
            onClick={onYes}
            className="w-full"
            isPulsing={true}
          >
            Yes
          </GlowPillButton>
        </div>

        <div
          onMouseEnter={() => setButtonHover('no')}
          onMouseLeave={() => setButtonHover('none')}
        >
          <GlowPillButton
            variant="no"
            size="sm"
            onClick={onNo}
            className="opacity-75 hover:opacity-100"
          >
            No...
          </GlowPillButton>
        </div>
      </div>
    </motion.div>
  );
};
