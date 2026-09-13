import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayeredMascot } from '../character/LayeredMascot';
import { GlowPillButton } from '../ui/GlowPillButton';
import { HolographicSticker } from '../effects/HolographicSticker';
import { WashiTape } from '../ui/WashiTape';
import { AppleEmoji } from '../ui/AppleEmoji';

interface Scene3MeltdownProps {
  onYes: () => void;
  onNo: () => void;
}

export const Scene3Meltdown: React.FC<Scene3MeltdownProps> = ({
  onYes,
  onNo,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center w-full text-center select-none relative max-w-xl mx-auto"
    >
      <div className="relative mb-3 flex items-center justify-center">
        <WashiTape variant="pink" rotation={-4} width="w-28" className="absolute -top-3 left-2 pointer-events-none" />
        <HolographicSticker rotation={-2} variant="pink">
          <span className="font-monoTag text-xs text-[#fbcfe8] uppercase font-bold tracking-wider flex items-center gap-1">
            <span>[EMOTIONAL_DAMAGE: LVL_999]</span>
            <AppleEmoji emoji="💔" className="w-4 h-4 inline-block" />
          </span>
        </HolographicSticker>
      </div>

      <h1 className="font-apple font-black text-4xl sm:text-6xl text-silkWhite uppercase tracking-tight drop-shadow-[0_2px_20px_rgba(255,255,255,0.3)] mb-1">
        NO... REALLY?
      </h1>

      <h2 className="font-curvy italic font-bold text-3xl sm:text-5xl text-roseGlow drop-shadow-[0_0_25px_rgba(255,77,136,0.6)] mb-2 flex items-center justify-center gap-2">
        <span>are you truly fr right now?</span>
        
      </h2>

      <p className="font-apple text-sm sm:text-base text-[#f5c2d3]/90 mb-4 flex items-center justify-center gap-1.5">
        <span>look how hard the tears are falling...</span>
        <AppleEmoji emoji="😭" className="w-4 h-4 inline-block" />
      </p>

      {/* Sobbing Mascot Rig with Teardrop Physics */}
      <div className="my-2 relative p-4 bg-white/[0.03] rounded-3xl border border-white/10 backdrop-blur-sm">
        <LayeredMascot pose="floor_cry" />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <GlowPillButton variant="yes" size="lg" onClick={onYes}>
          Yes
        </GlowPillButton>

        <div
          onMouseEnter={() => setIsWiggling(true)}
          onMouseLeave={() => setIsWiggling(false)}
          className={isWiggling ? 'animate-wiggle-intense' : ''}
        >
          <GlowPillButton variant="no" size="lg" onClick={onNo}>
            No
          </GlowPillButton>
        </div>
      </div>
    </motion.div>
  );
};
