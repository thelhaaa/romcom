import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { LayeredMascot } from '../character/LayeredMascot';
import { GlowPillButton } from '../ui/GlowPillButton';
import { HolographicSticker } from '../effects/HolographicSticker';
import { WashiTape } from '../ui/WashiTape';
import { AppleEmoji } from '../ui/AppleEmoji';
import { sound } from '../../utils/audioEngine';

interface Scene5CascadeProps {
  onYes: () => void;
  onNextNo: () => void;
}

export const Scene5Cascade: React.FC<Scene5CascadeProps> = ({
  onYes,
  onNextNo,
}) => {
  const [toast, setToast] = useState<string | null>(null);
  const [decoyClicks, setDecoyClicks] = useState(0);

  const toasts = [
    'Nice try ♡',
    'Not an option fr fr',
    'Every path leads here',
    'No escape from love',
    'Destined to be together',
    'Try all you want bb ♡',
  ];

  // Clean, aesthetically balanced decoy buttons flanking the sides (Zero overlap with text or mascot)
  const decoys = [
    { top: '22%', left: '8%', rot: '-6deg' },
    { top: '22%', right: '8%', rot: '6deg' },
    { top: '48%', left: '6%', rot: '8deg' },
    { top: '48%', right: '6%', rot: '-8deg' },
    { top: '74%', left: '10%', rot: '-4deg' },
    { top: '74%', right: '10%', rot: '4deg' },
  ];

  const isAdvancingRef = useRef(false);

  const handleNextNoSafely = () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    onNextNo();
  };

  const handleDecoyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playBoing();
    const nextCount = decoyClicks + 1;
    setDecoyClicks(nextCount);

    if (nextCount >= 4) {
      setToast('Okay, you are really persistent! ♡');
      setTimeout(() => {
        handleNextNoSafely();
      }, 350);
      return;
    }

    const msg = toasts[Math.floor(Math.random() * toasts.length)];
    setToast(msg);
    setTimeout(() => setToast(null), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative w-full min-h-[540px] flex flex-col items-center justify-center text-center select-none"
    >
      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 z-50 px-6 py-2 rounded-full bg-gradient-to-r from-neonPink to-roseGlow text-white font-apple font-semibold text-base shadow-[0_0_25px_rgba(255,42,133,0.8)] border border-white/50 flex items-center gap-1.5"
        >
          <span>{toast}</span>
          <AppleEmoji emoji="✨" className="w-4 h-4 inline-block" />
        </motion.div>
      )}

      {/* Floating Multiplying Decoy NO Buttons */}
      {decoys.map((d, i) => (
        <motion.button
          key={i}
          onClick={handleDecoyClick}
          whileHover={{ scale: 1.15, rotate: 0 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: d.top,
            left: d.left,
            right: d.right,
            transform: `rotate(${d.rot})`,
            zIndex: 15,
          }}
          className={`px-5 py-2 rounded-full bg-white/95 hover:bg-white text-[#2a0e20] font-button text-xs font-bold tracking-wider shadow-lg border border-pink-200/50 backdrop-blur-sm transition-transform ${
            (i === 2 || i === 3) ? 'hidden sm:block' : ''
          }`}
        >
          No
        </motion.button>
      ))}

      {/* Centerpiece: Poster Headline & Sobbing Character */}
      <div className="relative z-20 flex flex-col items-center">
        <div className="relative mb-3 flex items-center justify-center">
          <WashiTape variant="gold" rotation={-5} width="w-24" className="absolute -top-3 -left-3 pointer-events-none" />
          <HolographicSticker rotation={3} variant="pink">
            <span className="font-monoTag text-[11px] text-[#fbcfe8] tracking-wider uppercase font-semibold flex items-center gap-1">
              <span>[DESTINY_LOOP: 0_ESCAPE_ROUTES]</span>
              <AppleEmoji emoji="🥺" className="w-3.5 h-3.5 inline-block" />
            </span>
          </HolographicSticker>
        </div>

        <h1 className="font-apple font-black text-4xl sm:text-6xl uppercase tracking-tight text-silkWhite drop-shadow-[0_2px_20px_rgba(255,255,255,0.3)] mb-1">
          NO WAY OUT
        </h1>

        <h2 className="font-curvy italic font-bold text-3xl sm:text-5xl text-roseGlow drop-shadow-[0_0_25px_rgba(255,77,136,0.6)] mb-2 flex items-center justify-center gap-2">
          <span>every path leads to you & me</span>
          <AppleEmoji emoji="💖" className="w-7 h-7 inline-block" />
        </h2>

        <p className="font-apple text-sm sm:text-base text-[#fbcfe8]/90 mb-3 flex items-center justify-center gap-1.5">
          <span>the buttons are literally multiplying rn lol</span>
          <AppleEmoji emoji="😭" className="w-4 h-4 inline-block" />
        </p>

        {/* Sobbing Mascot Rig */}
        <div className="my-2 p-3 bg-white/[0.03] rounded-3xl border border-white/10">
          <LayeredMascot pose="floor_cry" />
        </div>

        {/* Center Radiant Growing YES Button */}
        <div className="mt-4 flex flex-col items-center gap-3">
          <GlowPillButton
            variant="yes"
            size="xl"
            onClick={onYes}
            isPulsing={true}
          >
            Yes
          </GlowPillButton>

          <button
            onClick={handleNextNoSafely}
            className="text-balletPink/70 hover:text-white font-apple text-xs tracking-wider uppercase underline underline-offset-4 mt-2 flex items-center gap-1 transition-colors"
          >
            <span>(still trying to refuse? click here)</span>
            <AppleEmoji emoji="🥺" className="w-3.5 h-3.5 inline-block" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
