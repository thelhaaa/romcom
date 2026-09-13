import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowPillButton } from '../ui/GlowPillButton';
import { HolographicSticker } from '../effects/HolographicSticker';
import { WashiTape } from '../ui/WashiTape';
import { DevelopingPolaroid } from '../ui/DevelopingPolaroid';
import { CrackedWaxSeal } from '../ui/CrackedWaxSeal';
import { SignaturePad } from '../ui/SignaturePad';
import { LoveReceipt } from '../ui/LoveReceipt';
import { AppleEmoji } from '../ui/AppleEmoji';
import { sound } from '../../utils/audioEngine';
import { triggerCinematicCelebration } from '../../utils/confettiEngine';
import { Scroll, Receipt, CheckCircle2 } from 'lucide-react';

interface Scene8CelebrationProps {
  onReplay: () => void;
}

export const Scene8Celebration: React.FC<Scene8CelebrationProps> = ({ onReplay }) => {
  const [showAgreement, setShowAgreement] = useState(false);
  const [activeTab, setActiveTab] = useState<'agreement' | 'receipt'>('agreement');
  const [partnerName, setPartnerName] = useState('My Forever Valentine');
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    // Initial celebration burst
    const timer = setTimeout(() => {
      sound.startMusicBox();
      triggerCinematicCelebration();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleMoreCelebration = () => {
    sound.playFanfare();
    triggerCinematicCelebration();
  };

  const handleSealBroken = () => {
    // Delay slightly to let the wax fracture animation play
    setTimeout(() => {
      setShowAgreement(true);
      sound.playFanfare();
      triggerCinematicCelebration();
    }, 600);
  };

  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 text-center select-none">
      <AnimatePresence mode="wait">
        {!showAgreement ? (
          // ==================================================================
          // ACT 1: Climax Bloom, Instant Developing Polaroid, & Wax Seal Envelope
          // ==================================================================
          <motion.div
            key="act1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center w-full max-w-xl mx-auto"
          >
            {/* Status Sticker */}
            <div className="relative mb-2 flex items-center justify-center">
              <WashiTape variant="pink" rotation={-5} width="w-28" className="absolute -top-3 -left-2 pointer-events-none" />
              <HolographicSticker rotation={-3} variant="pink">
                <span className="font-monoTag text-xs text-[#fbcfe8] uppercase font-bold tracking-wider flex items-center gap-1">
                  <span>[OFFICIAL_STATUS: LOVED_FOREVER]</span>
                  <AppleEmoji emoji="💖" className="w-3.5 h-3.5 inline-block" />
                </span>
              </HolographicSticker>
            </div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="my-3"
            >
              <h1 className="font-apple font-black text-5xl sm:text-7xl md:text-8xl uppercase tracking-tight text-silkWhite drop-shadow-[0_4px_30px_rgba(255,255,255,0.35)]">
                YOU SAID YES!
              </h1>
              <h2 className="font-curvy italic font-bold text-4xl sm:text-6xl text-roseGlow mt-2 tracking-wide drop-shadow-[0_0_25px_rgba(255,77,136,0.6)] flex items-center justify-center gap-2">
                <span>Forever starts now</span>
                <AppleEmoji emoji="💖" className="w-8 h-8 inline-block" />
              </h2>
            </motion.div>

            {/* Instant Developing Polaroid */}
            <div className="my-5">
              <DevelopingPolaroid rotation={-2} />
            </div>

            <p className="font-curvy italic text-xl sm:text-2xl text-silkWhite/90 max-w-md mx-auto my-2 leading-relaxed">
              “I knew you would choose me. You're stuck with me now, through every sunrise and midnight.”
            </p>

            {/* Wax Sealed Envelope Prompt */}
            <div className="mt-8 sm:mt-10 mb-4 flex flex-col items-center">
              <p className="text-xs font-mono uppercase tracking-widest text-rose-300/85 mb-8">
                ✦ Tap to crack the wax seal & open agreement ✦
              </p>
              <CrackedWaxSeal onCrack={handleSealBroken} size={110} />
            </div>
          </motion.div>
        ) : (
          // ==================================================================
          // ACT 2: Love Agreement & Receiptify Audit
          // ==================================================================
          <motion.div
            key="act2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col items-center max-w-2xl"
          >
            {/* Header */}
            <div className="mb-4">
              <h1 className="font-apple font-black text-4xl sm:text-5xl uppercase tracking-tight text-silkWhite drop-shadow-[0_2px_20px_rgba(255,255,255,0.3)] mb-1">
                OUR SACRED BOND
              </h1>
              <h3 className="font-curvy italic font-bold text-2xl sm:text-3xl text-roseGlow/90 flex items-center justify-center gap-2">
                <span>Certified & Sealed with Love</span>
                <AppleEmoji emoji="🥂" className="w-6 h-6 inline-block" />
              </h3>
            </div>

            {/* Apple-style Frosted Segmented Control Tabs */}
            <div className="flex items-center gap-1 p-1 bg-black/40 backdrop-blur-xl border border-white/15 rounded-full mb-6 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setActiveTab('agreement');
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-button uppercase tracking-wider font-semibold transition-all ${
                  activeTab === 'agreement'
                    ? 'bg-gradient-to-r from-[#d91d4e] to-[#991338] text-white shadow-md'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <Scroll className="w-3.5 h-3.5" />
                <span>Love Agreement</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  setActiveTab('receipt');
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-button uppercase tracking-wider font-semibold transition-all ${
                  activeTab === 'receipt'
                    ? 'bg-gradient-to-r from-[#d91d4e] to-[#991338] text-white shadow-md'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Receiptify Audit</span>
              </button>
            </div>

            {/* Tab 1: Love Agreement Contract */}
            {activeTab === 'agreement' && (
              <motion.div
                key="tab-agreement"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full bg-[#faf5ee] text-slate-800 p-6 sm:p-10 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(255,125,167,0.2)] border border-[#ebd8c5]"
              >
                {/* Washi Tapes */}
                <div className="absolute -top-3 -left-3 pointer-events-none">
                  <WashiTape variant="gold" rotation={-12} width="w-24" />
                </div>
                <div className="absolute -top-3 -right-3 pointer-events-none">
                  <WashiTape variant="pink" rotation={12} width="w-24" />
                </div>

                {/* Agreement Title */}
                <div className="text-center border-b border-[#e2cfbe] pb-4 mb-5">
                  <span className="text-[10px] font-mono tracking-widest text-[#8a6b77] uppercase block">
                    STATE OF TRUE LOVE • OFFICIAL CONTRACT NO. 2026-0214
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#3d1223] mt-1">
                    Partnership & Loyalty Agreement
                  </h3>
                </div>

                {/* Editable Recipient */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="font-sans text-xs text-zinc-500 font-medium">Entered into with:</span>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      autoFocus
                      className="font-curvy italic text-xl text-[#8b1437] bg-transparent border-b border-rose-400 outline-none text-center"
                    />
                  ) : (
                    <span
                      onClick={() => setIsEditingName(true)}
                      className="font-curvy italic text-xl font-bold text-[#8b1437] cursor-pointer hover:underline flex items-center gap-1.5"
                    >
                      {partnerName}
                      <span className="text-[10px] font-monoTag bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded">edit</span>
                    </span>
                  )}
                </div>

                {/* Clauses */}
                <div className="text-left space-y-3 font-sans text-xs sm:text-sm text-[#422934] mb-8 bg-[#f5ede3]/70 p-4 rounded-xl border border-[#dec9b6]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Clause 1 (Eternal Priority):</strong> The parties hereby agree to choose each other through all adventures, quiet moments, and late-night talks.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Clause 2 (Snack & Hug Tax):</strong> All snacks purchased belong to both parties. Forehead kisses and warm hugs are non-negotiable and unlimited.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Clause 3 (Patience & Support):</strong> Neither party shall stay mad for long. Apologies come with warm embraces and sweet treats.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>Clause 4 (No Refunds):</strong> This agreement is sealed in perpetuity and cannot be revoked under any celestial law.</span>
                  </div>
                </div>

                {/* Digital Signature Pad */}
                <div className="w-full mb-4">
                  <p className="text-[11px] font-mono tracking-wider text-[#73505e] mb-2 uppercase">
                    ✦ Sign Below to Ratify Agreement ✦
                  </p>
                  <SignaturePad
                    onSigned={() => {
                      triggerCinematicCelebration();
                    }}
                  />
                </div>
              </motion.div>
            )}

            {/* Tab 2: Love Receiptify Audit */}
            {activeTab === 'receipt' && (
              <motion.div
                key="tab-receipt"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full flex justify-center"
              >
                <LoveReceipt />
              </motion.div>
            )}

            {/* Bottom Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
              <GlowPillButton variant="yes" size="lg" onClick={handleMoreCelebration}>
                Celebrate Again
              </GlowPillButton>

              <button
                onClick={onReplay}
                className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-pink-300/40 text-balletPink font-button text-xs font-bold tracking-[0.16em] uppercase transition-all active:scale-95 shadow-md"
              >
                Replay Experience
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
