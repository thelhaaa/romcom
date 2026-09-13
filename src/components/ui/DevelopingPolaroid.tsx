import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sound } from '../../utils/audioEngine';
import { triggerHaptic } from '../../hooks/useMobileSensors';
import { WashiTape } from './WashiTape';
import { AppleEmoji } from './AppleEmoji';
import { Sparkles, Camera } from 'lucide-react';

interface DevelopingPolaroidProps {
  className?: string;
  rotation?: number;
}

export const DevelopingPolaroid: React.FC<DevelopingPolaroidProps> = ({
  className = '',
  rotation = -2,
}) => {
  const [stage, setStage] = useState<'blank' | 'developing' | 'developed'>('blank');
  const [captionText, setCaptionText] = useState('');
  const fullCaption = 'Us, today & forever ♡';

  useEffect(() => {
    sound.playShutter();
    triggerHaptic([40, 60]);

    // Stage 1: Film ejected, begins developing
    const t1 = setTimeout(() => {
      setStage('developing');
    }, 400);

    // Stage 2: Fully developed
    const t2 = setTimeout(() => {
      setStage('developed');
      triggerHaptic(30);

      // Typewriter caption effect
      let charIdx = 0;
      const typeInterval = setInterval(() => {
        if (charIdx <= fullCaption.length) {
          setCaptionText(fullCaption.slice(0, charIdx));
          charIdx++;
        } else {
          clearInterval(typeInterval);
        }
      }, 70);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, rotate: rotation }}
      animate={{ y: 0, opacity: 1, rotate: rotation }}
      whileHover={{ scale: 1.04, rotate: rotation + 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative bg-[#fcfbfa] p-3 pb-5 rounded-sm shadow-[0_20px_45px_rgba(0,0,0,0.65),0_2px_8px_rgba(0,0,0,0.2)] border border-[#e8dfd5] select-none text-center inline-block max-w-[260px] sm:max-w-[280px] ${className}`}
    >
      {/* Top Cute Washi Tape */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
        <WashiTape variant="pink" rotation={-2} width="w-24" />
      </div>

      {/* Camera shutter flash badge */}
      <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-mono text-white/90">
        <Camera className="w-2.5 h-2.5 text-rose-300" />
        <span>INSTAX 600</span>
      </div>

      {/* Polaroid Picture Frame Area */}
      <div className="relative overflow-hidden bg-[#1f191b] rounded-sm w-56 h-60 sm:w-60 sm:h-64 flex items-center justify-center shadow-inner">
        {/* Memory Artwork: Two Mochi characters stargazing under moon & hearts */}
        <motion.div
          animate={
            stage === 'blank'
              ? { filter: 'brightness(0.12) blur(8px) contrast(2)', scale: 1.05 }
              : stage === 'developing'
              ? { filter: 'brightness(0.65) blur(2px) sepia(0.5)', scale: 1.02 }
              : { filter: 'brightness(1) blur(0px) sepia(0)', scale: 1 }
          }
          transition={{ duration: 2.2, ease: 'easeOut' }}
          className="relative w-full h-full bg-gradient-to-b from-[#120619] via-[#2a0b27] to-[#421232] flex items-center justify-center p-3"
        >
          {/* Subtle starfield particles inside photo */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffc2d4_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Crescent Moon */}
          <div className="absolute top-4 right-5 w-7 h-7 rounded-full bg-amber-200/90 shadow-[0_0_12px_#fde68a]" />

          {/* Heart Constellation in Photo Sky */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 200 200">
            <polyline
              points="100,50 85,35 70,45 80,65 100,85 120,65 130,45 115,35 100,50"
              fill="none"
              stroke="#ffd1dc"
              strokeWidth="1.2"
              strokeDasharray="2 3"
            />
            <circle cx="100" cy="50" r="2.5" fill="#ffffff" />
            <circle cx="85" cy="35" r="2" fill="#ffffff" />
            <circle cx="70" cy="45" r="2" fill="#ffffff" />
            <circle cx="130" cy="45" r="2" fill="#ffffff" />
            <circle cx="115" cy="35" r="2" fill="#ffffff" />
            <circle cx="100" cy="85" r="2.5" fill="#ffffff" />
          </svg>

          {/* Couple Illustration: Two Mochis cuddling */}
          <div className="relative z-10 flex items-end justify-center -space-x-4 mt-8">
            {/* Left Mochi */}
            <div className="relative w-20 h-20 bg-gradient-to-b from-white to-[#fcedf3] rounded-[45%_45%_40%_40%] shadow-md border-2 border-[#2b0c1e] flex flex-col items-center justify-center">
              {/* Ears */}
              <div className="absolute -top-3 left-2 w-4 h-5 bg-white border-2 border-[#2b0c1e] rounded-full" />
              <div className="absolute -top-3 right-2 w-4 h-5 bg-white border-2 border-[#2b0c1e] rounded-full" />
              {/* Happy eyes */}
              <div className="flex gap-3 text-sm text-[#2b0c1e] font-black -mt-1">
                <span>◠</span>
                <span>◠</span>
              </div>
              {/* Blush */}
              <div className="flex justify-between w-12 -mt-1">
                <div className="w-2.5 h-1.5 bg-rose-400/80 rounded-full" />
                <div className="w-2.5 h-1.5 bg-rose-400/80 rounded-full" />
              </div>
            </div>

            {/* Right Mochi with flower */}
            <div className="relative w-18 h-18 bg-gradient-to-b from-white to-[#f7e6ec] rounded-[45%_45%_40%_40%] shadow-md border-2 border-[#2b0c1e] flex flex-col items-center justify-center z-10">
              <AppleEmoji emoji="🌸" className="absolute -top-2 right-1 w-4 h-4 inline-block" />
              <div className="flex gap-2.5 text-xs text-[#2b0c1e] font-black -mt-1">
                <span>♡</span>
                <span>♡</span>
              </div>
              <div className="flex justify-between w-10 -mt-0.5">
                <div className="w-2 h-1 bg-rose-400/80 rounded-full" />
                <div className="w-2 h-1 bg-rose-400/80 rounded-full" />
              </div>
            </div>
          </div>

          {/* Heart above couple */}
          <motion.span
            animate={{ y: [0, -4, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-16 text-xl text-rose-400 select-none drop-shadow-[0_0_8px_rgba(255,100,150,0.8)]"
          >
            ♡
          </motion.span>
        </motion.div>

        {/* Instax chemical sheen sweep during development */}
        {stage !== 'developed' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '-100%' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-200/25 to-transparent pointer-events-none z-20"
          />
        )}

        {/* Vintage Film Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none z-20" />
      </div>

      {/* Caption Area */}
      <div className="mt-3 font-doodle text-sm sm:text-base text-[#3b1f2b] tracking-wide font-bold min-h-[24px] flex items-center justify-center">
        {captionText}
        {stage === 'developed' && captionText.length < fullCaption.length && (
          <span className="inline-block w-1.5 h-4 bg-[#3b1f2b] ml-0.5 animate-pulse" />
        )}
      </div>

      <div className="mt-1 flex items-center justify-center gap-1 text-[9px] font-mono text-[#8a6a75]/80">
        <Sparkles className="w-2.5 h-2.5 text-amber-500" />
        <span>DEVELOPED INSTANTLY</span>
      </div>
    </motion.div>
  );
};
