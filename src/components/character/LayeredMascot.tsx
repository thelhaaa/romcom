import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '../../utils/audioEngine';
import { triggerHaptic } from '../../hooks/useMobileSensors';

export type MascotPose =
  | 'rose'
  | 'lunge'
  | 'floor_cry'
  | 'puppy_eyes'
  | 'sign_plead'
  | 'hug_heart';

export interface LayeredMascotProps {
  pose: MascotPose;
  className?: string;
  isAnticipating?: boolean;
  lookX?: number;
  lookY?: number;
  buttonHover?: 'none' | 'yes' | 'no';
  isBlinking?: boolean;
  isPoked?: boolean;
  isBeingPetted?: boolean;
  onPoke?: () => void;
  onPet?: () => void;
  sadLevel?: number; // 0 = startled, 1 = pouty teary, 2 = puppy weeping, 3+ = sobbing tears
}

/**
 * Ultra-Cute Living Mochi Mascot Rig
 * - Chubby mochi anatomy with pastel gradient cheeks & sparkling anime eyes
 * - Interactive gaze tracking: pupils follow cursor
 * - Involuntary natural blinking & ear twitches
 * - Reactive hover anticipation: excited heart-eyes on YES, trembling sad pout on NO
 * - Interactive squishy poke & petting purr: stroke/rub triggers purr sound, squish, happy eyes
 * - Ballistic teardrop physics arcs & splash puddles
 */
export const LayeredMascot: React.FC<LayeredMascotProps> = ({
  pose,
  className = '',
  isAnticipating = false,
  lookX: extLookX,
  lookY: extLookY,
  buttonHover: extButtonHover,
  isBlinking: extIsBlinking,
  isPoked: extIsPoked,
  isBeingPetted: extIsBeingPetted,
  onPoke,
  onPet,
  sadLevel = 0,
}) => {
  // Internal fallbacks if not controlled by parent
  const [internalLook, setInternalLook] = useState({ x: 0, y: 0 });
  const [internalBlink, setInternalBlink] = useState(false);
  const [internalPoked, setInternalPoked] = useState(false);
  const [internalPetting, setInternalPetting] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const heartIdRef = useRef(0);
  const strokeDistRef = useRef(0);
  const lastStrokeTimeRef = useRef(Date.now());
  const petTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (extLookX !== undefined && extLookY !== undefined) return;
    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setInternalLook({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [extLookX, extLookY]);

  useEffect(() => {
    if (extIsBlinking !== undefined) return;
    let timer: ReturnType<typeof setTimeout>;
    const loopBlink = () => {
      timer = setTimeout(() => {
        setInternalBlink(true);
        setTimeout(() => {
          setInternalBlink(false);
          loopBlink();
        }, 140);
      }, Math.random() * 3200 + 2400);
    };
    loopBlink();
    return () => clearTimeout(timer);
  }, [extIsBlinking]);

  const lookX = extLookX !== undefined ? extLookX : internalLook.x;
  const lookY = extLookY !== undefined ? extLookY : internalLook.y;
  const isBlinking = extIsBlinking !== undefined ? extIsBlinking : internalBlink;
  const isPoked = extIsPoked !== undefined ? extIsPoked : internalPoked;
  const isBeingPetted = extIsBeingPetted !== undefined ? extIsBeingPetted : internalPetting;
  const buttonHover = extButtonHover || 'none';

  // Handle Mascot Petting / Stroke
  const handlePointerStroke = (e: React.PointerEvent) => {
    const now = Date.now();
    strokeDistRef.current += Math.hypot(e.movementX || 0, e.movementY || 0);
    if (strokeDistRef.current > 35 && now - lastStrokeTimeRef.current > 350) {
      strokeDistRef.current = 0;
      lastStrokeTimeRef.current = now;
      sound.playPurr();
      triggerHaptic(25);
      if (onPet) {
        onPet();
      } else {
        setInternalPetting(true);
        if (petTimerRef.current) clearTimeout(petTimerRef.current);
        petTimerRef.current = setTimeout(() => setInternalPetting(false), 950);
      }
      const newHearts = [
        { id: heartIdRef.current++, x: -20 + Math.random() * 40, y: -45 },
      ];
      setFloatingHearts((prev) => [...prev, ...newHearts]);
      setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
      }, 1200);
    }
  };

  // Handle Mascot Squishy Poke
  const handlePokeClick = () => {
    sound.playSqueak();
    triggerHaptic(35);
    if (onPoke) {
      onPoke();
    } else {
      setInternalPoked(true);
      setTimeout(() => setInternalPoked(false), 600);
    }

    // Spawn 2-3 floating cute hearts from head
    const newHearts = [
      { id: heartIdRef.current++, x: -25 + Math.random() * 15, y: -40 },
      { id: heartIdRef.current++, x: 15 + Math.random() * 15, y: -45 },
    ];
    setFloatingHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1200);
  };

  // Shared visual styles
  const ink = '#180414';
  const cream = '#fefcf9';
  const innerEar = '#ffc2d4';
  const blush = '#ff7da7';

  // Eye pupil offset based on gaze tracking (-1 to 1)
  const pupilOffsetX = lookX * 3.5;
  const pupilOffsetY = lookY * 2.5;

  // --------------------------------------------------------------------------
  // 1. POSE: ROSE (Chapter 01 Main Proposal)
  // --------------------------------------------------------------------------
  if (pose === 'rose') {
    return (
      <div
        className={`relative flex items-center justify-center select-none cursor-pointer group ${className}`}
        onClick={handlePokeClick}
        onPointerMove={handlePointerStroke}
      >
        {/* Floating Heart Steam when Poked / Petted */}
        <AnimatePresence>
          {floatingHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, scale: 0.6, x: h.x, y: 0 }}
              animate={{ opacity: 0, scale: 1.2, x: h.x * 1.6, y: -70 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute pointer-events-none text-roseGlow font-sans text-xl z-30 font-bold"
            >
              ♡
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Hover / Petting Hint Bubble */}
        <div
          className={`absolute -top-7 transition-all bg-[#faf6f0] text-[#7a1631] font-doodle text-xs px-2.5 py-0.5 rounded-full border border-pink-300 shadow-sm pointer-events-none whitespace-nowrap ${
            isBeingPetted ? 'opacity-100 scale-105 bg-pink-100 border-pink-400' : 'opacity-0 group-hover:opacity-90'
          }`}
        >
          {isBeingPetted ? 'purrrrr... ♡' : 'pet or poke me! ♡'}
        </div>

        <motion.div
          animate={
            isBeingPetted
              ? { scaleX: [1.08, 1.14, 1.08], scaleY: [0.88, 0.82, 0.88], y: [6, 12, 6] }
              : isPoked
              ? { scaleX: 1.2, scaleY: 0.82, y: 12 }
              : buttonHover === 'yes'
              ? { scale: [1, 1.05, 1], y: [0, -6, 0], rotate: [-1, 2, -1] }
              : buttonHover === 'no'
              ? { scaleX: 0.94, scaleY: 1.04, y: 4, rotate: -3 }
              : isAnticipating
              ? { scaleX: 0.96, scaleY: 1.05, y: -3 }
              : { scaleX: [1, 1.02, 1], scaleY: [1, 0.98, 1], y: [0, -3, 0] }
          }
          transition={{
            type: isPoked ? 'spring' : 'keyframes',
            stiffness: 400,
            damping: 14,
            repeat: isPoked || (!isBeingPetted && buttonHover !== 'none') ? 0 : Infinity,
            duration: isBeingPetted ? 0.9 : 3.8,
            ease: 'easeInOut',
          }}
          className="relative w-56 h-60 sm:w-64 sm:h-68"
        >
          <svg viewBox="0 0 220 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)]">
            <defs>
              <linearGradient id="mochiShine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f7f2ea" />
              </linearGradient>
              <radialGradient id="blushGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff6596" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#ff85ab" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff85ab" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="roseCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4d88" />
                <stop offset="50%" stopColor="#c2255c" />
                <stop offset="100%" stopColor="#6e0f2b" />
              </linearGradient>
            </defs>

            {/* Ground Shadow */}
            <ellipse cx="110" cy="214" rx="60" ry="10" fill="#080206" opacity="0.8" />

            {/* Chubby Feet */}
            <ellipse cx="90" cy="206" rx="16" ry="10" fill={cream} stroke={ink} strokeWidth="3.6" />
            <ellipse cx="130" cy="206" rx="16" ry="10" fill={cream} stroke={ink} strokeWidth="3.6" />

            {/* Plump Mochi Body */}
            <path
              d="M74 135 C60 160 65 200 110 200 C155 200 160 160 146 135 Z"
              fill="url(#mochiShine)"
              stroke={ink}
              strokeWidth="3.6"
              strokeLinejoin="round"
            />

            {/* Articulated Bunny-Bear Ears */}
            <motion.g
              animate={
                buttonHover === 'yes'
                  ? { rotate: [-4, 6, -4] }
                  : buttonHover === 'no'
                  ? { rotate: 22, y: 8 }
                  : { rotate: [-1, 2, -1] }
              }
              transition={{ duration: buttonHover === 'yes' ? 0.35 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '70px 65px' }}
            >
              <ellipse cx="70" cy="52" rx="13" ry="24" transform="rotate(-18 70 52)" fill={cream} stroke={ink} strokeWidth="3.6" />
              <ellipse cx="70" cy="52" rx="7" ry="16" transform="rotate(-18 70 52)" fill={innerEar} />
            </motion.g>

            <motion.g
              animate={
                buttonHover === 'yes'
                  ? { rotate: [4, -6, 4] }
                  : buttonHover === 'no'
                  ? { rotate: -22, y: 8 }
                  : { rotate: [1, -2, 1] }
              }
              transition={{ duration: buttonHover === 'yes' ? 0.35 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '150px 65px' }}
            >
              <ellipse cx="150" cy="52" rx="13" ry="24" transform="rotate(18 150 52)" fill={cream} stroke={ink} strokeWidth="3.6" />
              <ellipse cx="150" cy="52" rx="7" ry="16" transform="rotate(18 150 52)" fill={innerEar} />
            </motion.g>

            {/* Round Chubby Head */}
            <circle cx="110" cy="98" r="46" fill="url(#mochiShine)" stroke={ink} strokeWidth="3.6" />

            {/* Glowing Gradient Cheeks */}
            <ellipse cx="82" cy="112" rx="11" ry="7" fill="url(#blushGlow)" />
            <ellipse cx="138" cy="112" rx="11" ry="7" fill="url(#blushGlow)" />

            {/* Eyes Group with Gaze Tracking and Blinking */}
            <g transform={`translate(${pupilOffsetX}, ${pupilOffsetY})`}>
              {/* Left Eye */}
              <motion.g
                animate={{ scaleY: isBlinking ? 0.08 : 1 }}
                transition={{ duration: 0.08 }}
                style={{ transformOrigin: '92px 96px' }}
              >
                {isBeingPetted ? (
                  // Ecstatic Happy Curved Eye (◠) when petted
                  <path
                    d="M84 96 Q92 88 100 96"
                    stroke={ink}
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                ) : buttonHover === 'yes' ? (
                  // Heart Eyes when hovering YES
                  <path
                    d="M92 90 C89 86 84 87 84 91 C84 95 92 100 92 100 C92 100 100 95 100 91 C100 87 95 86 92 90 Z"
                    fill="#ff2a85"
                    stroke={ink}
                    strokeWidth="1.5"
                  />
                ) : buttonHover === 'no' ? (
                  // Watery Pouting Eyes when hovering NO
                  <g>
                    <ellipse cx="92" cy="96" rx="8" ry="10" fill={ink} />
                    <circle cx="90" cy="93" r="3.5" fill="#ffffff" />
                    <circle cx="94" cy="99" r="1.8" fill="#74c0fc" />
                    {/* Water drop welling up */}
                    <ellipse cx="92" cy="103" rx="4" ry="2" fill="#74c0fc" opacity="0.8" />
                  </g>
                ) : (
                  // Normal Sparkling Kawaii Eye
                  <g>
                    <ellipse cx="92" cy="96" rx="7.5" ry="10.5" fill={ink} />
                    <circle cx="90" cy="92" r="3.2" fill="#ffffff" />
                    <circle cx="94.5" cy="98" r="1.5" fill="#ffffff" />
                  </g>
                )}
              </motion.g>

              {/* Right Eye */}
              <motion.g
                animate={{ scaleY: isBlinking ? 0.08 : 1 }}
                transition={{ duration: 0.08 }}
                style={{ transformOrigin: '128px 96px' }}
              >
                {isBeingPetted ? (
                  // Ecstatic Happy Curved Eye (◠) when petted
                  <path
                    d="M120 96 Q128 88 136 96"
                    stroke={ink}
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                ) : buttonHover === 'yes' ? (
                  // Heart Eyes when hovering YES
                  <path
                    d="M128 90 C125 86 120 87 120 91 C120 95 128 100 128 100 C128 100 136 95 136 91 C136 87 131 86 128 90 Z"
                    fill="#ff2a85"
                    stroke={ink}
                    strokeWidth="1.5"
                  />
                ) : buttonHover === 'no' ? (
                  // Watery Pouting Eyes when hovering NO
                  <g>
                    <ellipse cx="128" cy="96" rx="8" ry="10" fill={ink} />
                    <circle cx="126" cy="93" r="3.5" fill="#ffffff" />
                    <circle cx="130" cy="99" r="1.8" fill="#74c0fc" />
                    <ellipse cx="128" cy="103" rx="4" ry="2" fill="#74c0fc" opacity="0.8" />
                  </g>
                ) : (
                  // Normal Sparkling Kawaii Eye
                  <g>
                    <ellipse cx="128" cy="96" rx="7.5" ry="10.5" fill={ink} />
                    <circle cx="126" cy="92" r="3.2" fill="#ffffff" />
                    <circle cx="130.5" cy="98" r="1.5" fill="#ffffff" />
                  </g>
                )}
              </motion.g>
            </g>

            {/* Mouth depending on state */}
            {isBeingPetted ? (
              // Cute purring smile (ω)
              <path
                d="M102 110 Q106 114 110 110 Q114 114 118 110"
                stroke={ink}
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
            ) : buttonHover === 'yes' ? (
              // Open Happy Smile with Tongue
              <g>
                <path d="M104 108 Q110 117 116 108" fill="#ff4d88" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
              </g>
            ) : buttonHover === 'no' ? (
              // Trembling Sad Pout
              <motion.path
                animate={{ y: [0, -1, 0] }}
                transition={{ duration: 0.15, repeat: Infinity }}
                d="M104 113 Q110 108 116 113"
                stroke={ink}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              // Cute Cat Beak w-curve
              <path d="M104 108 Q107 111 110 109 Q113 111 116 108" stroke={ink} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            )}

            {/* Crimson Botanical Rose Presentation */}
            <g transform="translate(110, 155)">
              <path d="M0 10 C3 25 -2 38 4 52" stroke="#230d1a" strokeWidth="3" strokeLinecap="round" />
              <path d="M2 24 Q14 20 18 26 Q10 32 3 30" fill="#1b0814" stroke="#3b172a" strokeWidth="1.2" />
              <ellipse cx="0" cy="5" rx="16" ry="12" fill="url(#roseCrimson)" stroke={ink} strokeWidth="2.4" />
              <circle cx="0" cy="0" r="5" fill="#ff7da7" />
              {/* Soft Rose Glow Aura */}
              <circle cx="0" cy="5" r="18" fill="none" stroke="#ff4d88" strokeWidth="1" opacity="0.3" />
            </g>

            {/* Cute Little Paws Holding Stem */}
            <circle cx="98" cy="162" r="7" fill={cream} stroke={ink} strokeWidth="3" />
            <circle cx="122" cy="162" r="7" fill={cream} stroke={ink} strokeWidth="3" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. POSE: LUNGE (Chapter 02 Evasion with Escalating Sadness)
  // --------------------------------------------------------------------------
  if (pose === 'lunge') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <motion.div
          animate={
            sadLevel >= 3
              ? { x: [-2, 2, -2], y: [0, -3, 0], rotate: [-1, 1, -1] }
              : sadLevel >= 2
              ? { x: [-1, 1, -1], y: [0, -2, 0] }
              : isAnticipating
              ? { x: -10, scaleX: 0.94, scaleY: 1.06 }
              : { x: [0, 14, 0], scaleX: [1, 1.05, 1], scaleY: [1, 0.96, 1] }
          }
          transition={{
            duration: sadLevel >= 2 ? 0.25 : 0.45,
            repeat: sadLevel >= 2 ? Infinity : 0,
            ease: 'easeOut',
          }}
          className="relative w-60 h-60 sm:w-68 sm:h-68"
        >
          <svg viewBox="0 0 250 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]">
            <ellipse cx="120" cy="204" rx="72" ry="9" fill="#080206" opacity="0.8" />
            <ellipse cx="64" cy="195" rx="16" ry="9" transform="rotate(-15 64 195)" fill={cream} stroke={ink} strokeWidth="3.6" />
            <ellipse cx="150" cy="200" rx="17" ry="10" fill={cream} stroke={ink} strokeWidth="3.6" />

            {/* Lunging Forward Torso */}
            <path
              d="M75 130 C72 165 96 194 135 188 C165 184 165 145 148 120 Z"
              fill={cream}
              stroke={ink}
              strokeWidth="3.6"
              strokeLinejoin="round"
            />

            {/* Head Lunging Rightward */}
            <g transform="translate(30, -2)">
              {/* Ears: Droop lower and lower as sadness increases */}
              {sadLevel === 0 ? (
                <>
                  <ellipse cx="68" cy="55" rx="15" ry="9" transform="rotate(-38 68 55)" fill={cream} stroke={ink} strokeWidth="3.6" />
                  <ellipse cx="68" cy="55" rx="8" ry="5" transform="rotate(-38 68 55)" fill={innerEar} />
                  <ellipse cx="135" cy="62" rx="14" ry="9" transform="rotate(18 135 62)" fill={cream} stroke={ink} strokeWidth="3.6" />
                  <ellipse cx="135" cy="62" rx="7" ry="5" transform="rotate(18 135 62)" fill={innerEar} />
                </>
              ) : sadLevel === 1 ? (
                <>
                  <ellipse cx="68" cy="58" rx="14" ry="9" transform="rotate(-12 68 58)" fill={cream} stroke={ink} strokeWidth="3.6" />
                  <ellipse cx="68" cy="58" rx="7" ry="5" transform="rotate(-12 68 58)" fill={innerEar} />
                  <ellipse cx="135" cy="64" rx="13" ry="9" transform="rotate(2 135 64)" fill={cream} stroke={ink} strokeWidth="3.6" />
                  <ellipse cx="135" cy="64" rx="6" ry="5" transform="rotate(2 135 64)" fill={innerEar} />
                </>
              ) : (
                <>
                  {/* Drooping Sad Ears for sadLevel >= 2 */}
                  <ellipse cx="66" cy="65" rx="14" ry="8" transform="rotate(24 66 65)" fill={cream} stroke={ink} strokeWidth="3.6" />
                  <ellipse cx="66" cy="65" rx="7" ry="4" transform="rotate(24 66 65)" fill={innerEar} />
                  <ellipse cx="136" cy="68" rx="13" ry="8" transform="rotate(-24 136 68)" fill={cream} stroke={ink} strokeWidth="3.6" />
                  <ellipse cx="136" cy="68" rx="6" ry="4" transform="rotate(-24 136 68)" fill={innerEar} />
                </>
              )}

              <circle cx="106" cy="85" r="43" fill={cream} stroke={ink} strokeWidth="3.6" />
              <ellipse cx="84" cy="96" rx="9" ry="6" fill={blush} opacity="0.8" />
              <ellipse cx="128" cy="96" rx="9" ry="6" fill={blush} opacity="0.8" />

              {/* Eyes: Change from Alert Shocked to Teary to Full Weeping */}
              {sadLevel === 0 ? (
                // Alert Surprised Pupils
                <>
                  <ellipse cx="90" cy="82" rx="9.5" ry="12" fill={ink} />
                  <circle cx="87" cy="78" r="4" fill="#ffffff" />
                  <circle cx="93" cy="85" r="1.8" fill="#ffffff" />

                  <ellipse cx="122" cy="82" rx="9.5" ry="12" fill={ink} />
                  <circle cx="119" cy="78" r="4" fill="#ffffff" />
                  <circle cx="125" cy="85" r="1.8" fill="#ffffff" />

                  <path d="M82 66 Q88 60 96 65" stroke={ink} strokeWidth="3" strokeLinecap="round" />
                  <path d="M116 65 Q124 60 130 66" stroke={ink} strokeWidth="3" strokeLinecap="round" />
                </>
              ) : sadLevel === 1 ? (
                // Watery Glistening Eyes with Tears Welling Up
                <>
                  <ellipse cx="90" cy="83" rx="9.5" ry="12" fill={ink} />
                  <circle cx="87" cy="79" r="4" fill="#ffffff" />
                  <circle cx="93" cy="87" r="2.2" fill="#74c0fc" />
                  <ellipse cx="90" cy="93" rx="5" ry="2.5" fill="#74c0fc" opacity="0.9" />

                  <ellipse cx="122" cy="83" rx="9.5" ry="12" fill={ink} />
                  <circle cx="119" cy="79" r="4" fill="#ffffff" />
                  <circle cx="125" cy="87" r="2.2" fill="#74c0fc" />
                  <ellipse cx="122" cy="93" rx="5" ry="2.5" fill="#74c0fc" opacity="0.9" />

                  <path d="M83 67 Q88 63 95 67" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
                  <path d="M117 67 Q124 63 129 67" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
                </>
              ) : (
                // Big Puppy Watery Eyes (sadLevel >= 2) with Tear Pools
                <>
                  <ellipse cx="90" cy="83" rx="10" ry="13" fill={ink} />
                  <circle cx="86" cy="78" r="4.5" fill="#ffffff" />
                  <circle cx="92" cy="88" r="2.8" fill="#74c0fc" />
                  <ellipse cx="90" cy="94" rx="7" ry="3.5" fill="#74c0fc" />

                  <ellipse cx="122" cy="83" rx="10" ry="13" fill={ink} />
                  <circle cx="118" cy="78" r="4.5" fill="#ffffff" />
                  <circle cx="124" cy="88" r="2.8" fill="#74c0fc" />
                  <ellipse cx="122" cy="94" rx="7" ry="3.5" fill="#74c0fc" />

                  {/* Sad Eyebrows Slanted Inward */}
                  <path d="M82 66 Q88 71 95 66" stroke={ink} strokeWidth="3" strokeLinecap="round" />
                  <path d="M117 66 Q124 71 130 66" stroke={ink} strokeWidth="3" strokeLinecap="round" />
                </>
              )}

              {/* Mouth: Gasping -> Trembling Pout -> Sobbing Chin */}
              {sadLevel === 0 ? (
                <ellipse cx="106" cy="99" rx="5" ry="7" fill="#7a1631" stroke={ink} strokeWidth="2.2" />
              ) : sadLevel === 1 ? (
                <path d="M100 102 Q106 97 112 102" stroke={ink} strokeWidth="2.8" strokeLinecap="round" fill="none" />
              ) : (
                <motion.path
                  animate={{ y: [0, -1, 0] }}
                  transition={{ duration: 0.15, repeat: Infinity }}
                  d="M99 104 Q106 97 113 104"
                  stroke={ink}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
              )}

              {/* Sweat Drop or Streaming Teardrops */}
              {sadLevel === 0 ? (
                <motion.path
                  animate={{ y: [-2, 4, -2], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  d="M152 68 C156 63 161 71 153 77 C145 71 148 63 152 68 Z"
                  fill="#74c0fc"
                  stroke={ink}
                  strokeWidth="1.6"
                />
              ) : sadLevel >= 2 ? (
                // Streaming Teardrops Down Cheeks for sadLevel >= 2
                <>
                  <motion.path
                    animate={{ pathLength: [0, 1], opacity: [0.95, 0.35] }}
                    transition={{ duration: 0.85, repeat: Infinity }}
                    d="M87 95 C84 108 81 122 78 136"
                    stroke="#74c0fc"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                  <motion.path
                    animate={{ pathLength: [0, 1], opacity: [0.95, 0.35] }}
                    transition={{ duration: 0.85, repeat: Infinity, delay: 0.3 }}
                    d="M125 95 C128 108 131 122 134 136"
                    stroke="#74c0fc"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                // Single tear droplet forming on cheek
                <motion.circle
                  animate={{ y: [0, 6], opacity: [0.8, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  cx="87"
                  cy="98"
                  r="3.5"
                  fill="#74c0fc"
                  stroke={ink}
                  strokeWidth="1"
                />
              )}
            </g>

            {/* Outstretched Reach Arms */}
            <path d="M115 135 C145 128 180 120 205 124" stroke={ink} strokeWidth="4.2" strokeLinecap="round" fill="none" />
            <ellipse cx="208" cy="124" rx="7" ry="7.5" fill={cream} stroke={ink} strokeWidth="3.2" />

            <path d="M100 148 C135 146 172 142 196 146" stroke={ink} strokeWidth="4.2" strokeLinecap="round" fill="none" />
            <ellipse cx="199" cy="146" rx="7" ry="7.5" fill={cream} stroke={ink} strokeWidth="3.2" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 3. POSE: FLOOR CRY (Chapter 03 Meltdown / Heartbreak)
  // --------------------------------------------------------------------------
  if (pose === 'floor_cry') {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`}>
        <motion.div
          animate={{ scaleX: [1, 1.03, 1], scaleY: [1, 0.97, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-64 h-52 sm:w-72 sm:h-56"
        >
          <svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]">
            {/* Ground Shadow */}
            <ellipse cx="130" cy="172" rx="90" ry="14" fill="#080206" opacity="0.8" />

            {/* Animated Puddle Ripples */}
            <motion.ellipse
              animate={{ rx: [14, 28, 14], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              cx="92"
              cy="172"
              ry="7"
              stroke="#74c0fc"
              strokeWidth="1.8"
              fill="#339af0"
              fillOpacity="0.4"
            />
            <motion.ellipse
              animate={{ rx: [10, 24, 10], opacity: [0.8, 0.2, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.6, ease: 'easeOut' }}
              cx="140"
              cy="174"
              ry="6"
              stroke="#74c0fc"
              strokeWidth="1.8"
              fill="#339af0"
              fillOpacity="0.4"
            />

            {/* Curled Collapsed Body */}
            <path
              d="M70 160 C65 120 108 112 145 124 C182 136 186 160 180 170 C155 176 90 176 70 160 Z"
              fill={cream}
              stroke={ink}
              strokeWidth="3.8"
            />

            {/* Drooping Head on Ground */}
            <circle cx="112" cy="132" r="38" fill={cream} stroke={ink} strokeWidth="3.8" />

            {/* Drooping Flattened Ears */}
            <ellipse cx="78" cy="138" rx="9" ry="16" transform="rotate(40 78 138)" fill={cream} stroke={ink} strokeWidth="3.6" />
            <ellipse cx="78" cy="138" rx="5" ry="10" transform="rotate(40 78 138)" fill={innerEar} />

            <ellipse cx="146" cy="138" rx="9" ry="16" transform="rotate(-40 146 138)" fill={cream} stroke={ink} strokeWidth="3.6" />
            <ellipse cx="146" cy="138" rx="5" ry="10" transform="rotate(-40 146 138)" fill={innerEar} />

            {/* Closed Crying Waterfall Eyes */}
            <path d="M96 134 Q103 129 110 134" stroke={ink} strokeWidth="3" strokeLinecap="round" />
            <path d="M120 134 Q127 129 134 134" stroke={ink} strokeWidth="3" strokeLinecap="round" />

            {/* Ballistic Teardrop Physics Streaming Down */}
            <motion.path
              animate={{ pathLength: [0, 1], opacity: [0.9, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              d="M98 136 C95 150 92 162 90 172"
              stroke="#74c0fc"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <motion.path
              animate={{ pathLength: [0, 1], opacity: [0.9, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
              d="M128 136 C131 150 134 162 136 172"
              stroke="#74c0fc"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Trembling Quivering Mouth */}
            <motion.path
              animate={{ y: [0, -1, 0] }}
              transition={{ duration: 0.12, repeat: Infinity }}
              d="M109 146 Q114 142 119 146"
              stroke={ink}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 4. POSE: PUPPY EYES (Option 4: Living Anime Puppy Eyes Rig)
  // --------------------------------------------------------------------------
  if (pose === 'puppy_eyes') {
    // Dynamic Gaze Offsets with Reactive Button Bias
    const gazeBiasX = buttonHover === 'no' ? 3.5 : buttonHover === 'yes' ? -3.5 : 0;
    const gazeBiasY = buttonHover !== 'none' ? 2.5 : 0;
    const effectiveGazeX = (extLookX !== undefined ? extLookX * 3.5 : internalLook.x * 3.5) + gazeBiasX;
    const effectiveGazeY = (extLookY !== undefined ? extLookY * 2.5 : internalLook.y * 2.5) + gazeBiasY;

    return (
      <div
        className={`relative flex items-center justify-center select-none cursor-pointer group ${className}`}
        onClick={handlePokeClick}
        onPointerMove={handlePointerStroke}
      >
        {/* Floating Hearts on Squish / Petting */}
        <AnimatePresence>
          {floatingHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, scale: 0.6, x: h.x, y: 0 }}
              animate={{ opacity: 0, scale: 1.2, x: h.x * 1.5, y: -60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute pointer-events-none text-roseGlow font-sans text-xl z-30 font-bold"
            >
              ♡
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Petting / Poke Whisper Bubble */}
        <div
          className={`absolute -top-7 transition-all bg-[#faf6f0] text-[#7a1631] font-doodle text-xs px-2.5 py-0.5 rounded-full border border-pink-300 shadow-sm pointer-events-none whitespace-nowrap z-30 ${
            isBeingPetted ? 'opacity-100 scale-105 bg-pink-100 border-pink-400' : 'opacity-0 group-hover:opacity-90'
          }`}
        >
          {isBeingPetted ? 'purrrrr... ♡' : 'pet me bb! ♡'}
        </div>

        <motion.div
          animate={
            isBeingPetted
              ? { scaleX: [1.06, 1.12, 1.06], scaleY: [0.92, 0.86, 0.92], y: [2, 6, 2] }
              : isPoked
              ? { scaleX: 1.18, scaleY: 0.84, y: 8 }
              : buttonHover === 'no'
              ? { scaleX: 0.96, scaleY: 1.04, y: [0, -2, 0] }
              : buttonHover === 'yes'
              ? { scale: [1, 1.04, 1], y: [0, -5, 0] }
              : { y: [0, -4, 0] }
          }
          transition={{
            duration: isBeingPetted ? 0.9 : buttonHover === 'no' ? 0.2 : 2.4,
            repeat: isBeingPetted || buttonHover === 'no' || buttonHover === 'yes' || !isPoked ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="relative w-56 h-44 sm:w-64 sm:h-48"
        >
          <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
            <defs>
              {/* Radial Iris Ambient Glow */}
              <radialGradient id="puppyIrisGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2c0822" />
                <stop offset="70%" stopColor="#150312" />
                <stop offset="100%" stopColor="#0a0108" />
              </radialGradient>
              <radialGradient id="puppyBlush" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff4d88" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#ff7da7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ff7da7" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="beatingHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff2a85" />
                <stop offset="60%" stopColor="#ff6596" />
                <stop offset="100%" stopColor="#ff9dbb" />
              </linearGradient>
            </defs>

            {/* Ground / Ledge Shadow */}
            <ellipse cx="110" cy="144" rx="72" ry="7" fill="#080206" opacity="0.85" />

            {/* Peeking Chubby Head */}
            <path
              d="M52 134 C44 70 76 40 110 40 C144 40 176 70 168 134 Z"
              fill={cream}
              stroke={ink}
              strokeWidth="3.8"
              strokeLinejoin="round"
            />

            {/* Articulated Ears with Reactive Tilt */}
            <motion.g
              animate={
                buttonHover === 'no'
                  ? { rotate: -36, y: 5 }
                  : buttonHover === 'yes'
                  ? { rotate: [-16, -26, -16], y: -3 }
                  : { rotate: [-24, -28, -24] }
              }
              transition={{ duration: buttonHover === 'yes' ? 0.4 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '72px 50px' }}
            >
              <ellipse cx="72" cy="46" rx="11" ry="19" transform="rotate(-25 72 46)" fill={cream} stroke={ink} strokeWidth="3.6" />
              <ellipse cx="72" cy="46" rx="6" ry="12" transform="rotate(-25 72 46)" fill={innerEar} />
            </motion.g>

            <motion.g
              animate={
                buttonHover === 'no'
                  ? { rotate: 36, y: 5 }
                  : buttonHover === 'yes'
                  ? { rotate: [16, 26, 16], y: -3 }
                  : { rotate: [24, 28, 24] }
              }
              transition={{ duration: buttonHover === 'yes' ? 0.4 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '148px 50px' }}
            >
              <ellipse cx="148" cy="46" rx="11" ry="19" transform="rotate(25 148 46)" fill={cream} stroke={ink} strokeWidth="3.6" />
              <ellipse cx="148" cy="46" rx="6" ry="12" transform="rotate(25 148 46)" fill={innerEar} />
            </motion.g>

            {/* Glowing Cheeks */}
            <motion.ellipse
              animate={{
                scale: buttonHover === 'yes' ? [1, 1.2, 1] : [1, 1.06, 1],
                opacity: buttonHover === 'no' ? 0.65 : 0.9,
              }}
              transition={{ duration: 1.8, repeat: Infinity }}
              cx="70"
              cy="110"
              rx="10"
              ry="7"
              fill="url(#puppyBlush)"
            />
            <motion.ellipse
              animate={{
                scale: buttonHover === 'yes' ? [1, 1.2, 1] : [1, 1.06, 1],
                opacity: buttonHover === 'no' ? 0.65 : 0.9,
              }}
              transition={{ duration: 1.8, repeat: Infinity }}
              cx="150"
              cy="110"
              rx="10"
              ry="7"
              fill="url(#puppyBlush)"
            />

            {/* ============================================================ */}
            {/* LIVING ANIME PUPPY EYES RIG: Gaze, Blink, Shimmer & Heartbeat */}
            {/* ============================================================ */}

            {/* LEFT EYE CONTAINER */}
            <g transform={`translate(${effectiveGazeX}, ${effectiveGazeY})`}>
              <motion.g
                animate={{
                  scaleY: isBlinking ? 0.08 : 1,
                  scale: buttonHover === 'no' ? 1.16 : buttonHover === 'yes' ? 1.05 : 1,
                }}
                transition={{
                  scaleY: { duration: 0.08 },
                  scale: { type: 'spring', stiffness: 300, damping: 20 },
                }}
                style={{ transformOrigin: '88px 90px' }}
              >
                {/* Deep Obsidian Iris with Ambient Radial Glow */}
                <ellipse cx="88" cy="90" rx="16.5" ry="21" fill="url(#puppyIrisGlow)" stroke={ink} strokeWidth="2.8" />

                {/* Subtle Inner Purple Ring */}
                <ellipse cx="88" cy="90" rx="14.5" ry="19" fill="none" stroke="#e879f9" strokeWidth="0.6" opacity="0.3" />

                {/* Watery Teardrop Pool welling at bottom rim on NO hover */}
                {buttonHover === 'no' && (
                  <motion.ellipse
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: [0.85, 1, 0.85], scaleY: [1, 1.15, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    cx="88"
                    cy="103"
                    rx="12"
                    ry="5"
                    fill="#74c0fc"
                    opacity="0.9"
                  />
                )}

                {/* Liquid Glassy Tear Sheen Sweep */}
                <motion.path
                  animate={{ opacity: [0.35, 0.8, 0.35], x: [-1.5, 2, -1.5] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  d="M78 86 C82 76 96 76 100 86"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Primary Large Shimmering Specular Glint */}
                <motion.circle
                  animate={{ scale: [1, 1.18, 1], opacity: [0.92, 1, 0.92] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  cx="83"
                  cy="80"
                  r="7"
                  fill="#ffffff"
                />

                {/* Secondary Star Sparkle Highlight */}
                <motion.g
                  animate={{ rotate: [-10, 10, -10], scale: [0.92, 1.14, 0.92] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '96px 97px' }}
                >
                  <circle cx="96" cy="97" r="3.2" fill="#ffffff" />
                  <path d="M96 92.5 L97.2 97 L100.5 97 L97.8 98.5 L99 101.5 L96 99.5 L93 101.5 L94.2 98.5 L91.5 97 L94.8 97 Z" fill="#ffffff" opacity="0.9" />
                </motion.g>

                {/* Micro Sparkle Accent Pinpoint */}
                <circle cx="80" cy="97" r="1.8" fill="#ffffff" opacity="0.85" />

                {/* Double-Beat "Lub-Dub" Specular Heart Reflection */}
                <motion.path
                  animate={
                    buttonHover === 'no'
                      ? { scale: [1, 1.25, 1.05, 1.32, 1], x: [-1, 1, -1] }
                      : { scale: [1, 1.28, 1.06, 1.34, 1] }
                  }
                  transition={{
                    duration: 1.25,
                    repeat: Infinity,
                    times: [0, 0.2, 0.36, 0.56, 1],
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: '89px 99px' }}
                  d="M89 94 C89 91.5 93 91.5 93 94 C93 97 89 99 89 99 C89 99 85 97 85 94 C85 91.5 89 91.5 89 94 Z"
                  fill="url(#beatingHeartGrad)"
                  filter="drop-shadow(0 0 3px rgba(255,42,133,0.85))"
                />
              </motion.g>
            </g>

            {/* RIGHT EYE CONTAINER */}
            <g transform={`translate(${effectiveGazeX}, ${effectiveGazeY})`}>
              <motion.g
                animate={{
                  scaleY: isBlinking ? 0.08 : 1,
                  scale: buttonHover === 'no' ? 1.16 : buttonHover === 'yes' ? 1.05 : 1,
                }}
                transition={{
                  scaleY: { duration: 0.08 },
                  scale: { type: 'spring', stiffness: 300, damping: 20 },
                }}
                style={{ transformOrigin: '132px 90px' }}
              >
                {/* Deep Obsidian Iris with Ambient Radial Glow */}
                <ellipse cx="132" cy="90" rx="16.5" ry="21" fill="url(#puppyIrisGlow)" stroke={ink} strokeWidth="2.8" />

                {/* Subtle Inner Purple Ring */}
                <ellipse cx="132" cy="90" rx="14.5" ry="19" fill="none" stroke="#e879f9" strokeWidth="0.6" opacity="0.3" />

                {/* Watery Teardrop Pool welling at bottom rim on NO hover */}
                {buttonHover === 'no' && (
                  <motion.ellipse
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: [0.85, 1, 0.85], scaleY: [1, 1.15, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    cx="132"
                    cy="103"
                    rx="12"
                    ry="5"
                    fill="#74c0fc"
                    opacity="0.9"
                  />
                )}

                {/* Liquid Glassy Tear Sheen Sweep */}
                <motion.path
                  animate={{ opacity: [0.35, 0.8, 0.35], x: [-1.5, 2, -1.5] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  d="M122 86 C126 76 140 76 144 86"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Primary Large Shimmering Specular Glint */}
                <motion.circle
                  animate={{ scale: [1, 1.18, 1], opacity: [0.92, 1, 0.92] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  cx="127"
                  cy="80"
                  r="7"
                  fill="#ffffff"
                />

                {/* Secondary Star Sparkle Highlight */}
                <motion.g
                  animate={{ rotate: [-10, 10, -10], scale: [0.92, 1.14, 0.92] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '140px 97px' }}
                >
                  <circle cx="140" cy="97" r="3.2" fill="#ffffff" />
                  <path d="M140 92.5 L141.2 97 L144.5 97 L141.8 98.5 L143 101.5 L140 99.5 L137 101.5 L138.2 98.5 L135.5 97 L138.8 97 Z" fill="#ffffff" opacity="0.9" />
                </motion.g>

                {/* Micro Sparkle Accent Pinpoint */}
                <circle cx="124" cy="97" r="1.8" fill="#ffffff" opacity="0.85" />

                {/* Double-Beat "Lub-Dub" Specular Heart Reflection */}
                <motion.path
                  animate={
                    buttonHover === 'no'
                      ? { scale: [1, 1.25, 1.05, 1.32, 1], x: [-1, 1, -1] }
                      : { scale: [1, 1.28, 1.06, 1.34, 1] }
                  }
                  transition={{
                    duration: 1.25,
                    repeat: Infinity,
                    times: [0, 0.2, 0.36, 0.56, 1],
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: '133px 99px' }}
                  d="M133 94 C133 91.5 137 91.5 137 94 C137 97 133 99 133 99 C133 99 129 97 129 94 C129 91.5 133 91.5 133 94 Z"
                  fill="url(#beatingHeartGrad)"
                  filter="drop-shadow(0 0 3px rgba(255,42,133,0.85))"
                />
              </motion.g>
            </g>

            {/* ============================================================ */}
            {/* REACTIVE EYEBROWS & MOUTH EXPRESSION                         */}
            {/* ============================================================ */}
            {buttonHover === 'no' ? (
              // Sad Inward-Slanted Eyebrows
              <>
                <path d="M74 69 Q84 75 96 69" stroke={ink} strokeWidth="3" strokeLinecap="round" />
                <path d="M124 69 Q136 75 146 69" stroke={ink} strokeWidth="3" strokeLinecap="round" />
                {/* Trembling Sad Pout */}
                <motion.path
                  animate={{ y: [0, -1, 0] }}
                  transition={{ duration: 0.14, repeat: Infinity }}
                  d="M104 115 Q110 110 116 115"
                  stroke={ink}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : buttonHover === 'yes' ? (
              // Happy Raised Eyebrows
              <>
                <path d="M76 63 Q86 57 96 63" stroke={ink} strokeWidth="3" strokeLinecap="round" />
                <path d="M124 63 Q134 57 144 63" stroke={ink} strokeWidth="3" strokeLinecap="round" />
                {/* Open Excited Smile */}
                <path d="M104 110 Q110 118 116 110" fill="#ff4d88" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
              </>
            ) : (
              // Innocent Raised Eyebrows & Kitten Mouth
              <>
                <path d="M78 65 Q88 60 96 65" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
                <path d="M124 65 Q132 60 142 65" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
                <path d="M105 111 Q107.5 113.5 110 111.5 Q112.5 113.5 115 111" stroke={ink} strokeWidth="2.6" strokeLinecap="round" fill="none" />
              </>
            )}

            {/* Tiny Paws Resting on Ledge */}
            <circle cx="78" cy="136" r="8" fill={cream} stroke={ink} strokeWidth="3.2" />
            <circle cx="142" cy="136" r="8" fill={cream} stroke={ink} strokeWidth="3.2" />
          </svg>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 5. POSE: SIGN PLEAD (Chapter 06 Vows - Living Pleading Anime Mascot)
  // --------------------------------------------------------------------------
  if (pose === 'sign_plead') {
    // Dynamic Gaze Offsets with Reactive Button Bias
    const gazeBiasX = buttonHover === 'no' ? 3.5 : buttonHover === 'yes' ? -3.5 : 0;
    const gazeBiasY = buttonHover !== 'none' ? 2 : 0;
    const effectiveGazeX = (extLookX !== undefined ? extLookX * 3.5 : internalLook.x * 3.5) + gazeBiasX;
    const effectiveGazeY = (extLookY !== undefined ? extLookY * 2.5 : internalLook.y * 2.5) + gazeBiasY;

    return (
      <div
        className={`relative flex items-center justify-center select-none cursor-pointer group ${className}`}
        onClick={handlePokeClick}
        onPointerMove={handlePointerStroke}
      >
        {/* Floating Hearts on Squish / Petting */}
        <AnimatePresence>
          {floatingHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, scale: 0.6, x: h.x, y: 0 }}
              animate={{ opacity: 0, scale: 1.2, x: h.x * 1.5, y: -60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute pointer-events-none text-roseGlow font-sans text-xl z-30 font-bold"
            >
              ♡
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Petting / Poke Whisper Bubble */}
        <div
          className={`absolute -top-7 transition-all bg-[#faf6f0] text-[#7a1631] font-doodle text-xs px-2.5 py-0.5 rounded-full border border-pink-300 shadow-sm pointer-events-none whitespace-nowrap z-30 ${
            isBeingPetted ? 'opacity-100 scale-105 bg-pink-100 border-pink-400' : 'opacity-0 group-hover:opacity-90'
          }`}
        >
          {isBeingPetted ? 'purrrrr... ♡' : 'please say yes bb! ♡'}
        </div>

        <motion.div
          animate={
            isBeingPetted
              ? { scaleX: [1.06, 1.12, 1.06], scaleY: [0.92, 0.86, 0.92], y: [2, 6, 2] }
              : isPoked
              ? { scaleX: 1.18, scaleY: 0.84, y: 8 }
              : buttonHover === 'no'
              ? { scaleX: 0.96, scaleY: 1.04, y: [0, -2, 0] }
              : buttonHover === 'yes'
              ? { scale: [1, 1.04, 1], y: [0, -5, 0] }
              : { y: [0, -3.5, 0] }
          }
          transition={{
            duration: isBeingPetted ? 0.9 : buttonHover === 'no' ? 0.2 : 2.5,
            repeat: isBeingPetted || buttonHover === 'no' || buttonHover === 'yes' || !isPoked ? Infinity : 0,
            ease: 'easeInOut',
          }}
          className="relative w-56 h-60 sm:w-64 sm:h-68"
        >
          <svg viewBox="0 0 220 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)]">
            <defs>
              <linearGradient id="signMochiShine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f7f2ea" />
              </linearGradient>
              <radialGradient id="signIrisGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2c0822" />
                <stop offset="70%" stopColor="#150312" />
                <stop offset="100%" stopColor="#0a0108" />
              </radialGradient>
              <radialGradient id="signBlushGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff4d88" stopOpacity="0.88" />
                <stop offset="60%" stopColor="#ff7da7" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ff7da7" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="signHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff2a85" />
                <stop offset="60%" stopColor="#ff6596" />
                <stop offset="100%" stopColor="#ff9dbb" />
              </linearGradient>
            </defs>

            {/* Ground Shadow */}
            <ellipse cx="110" cy="216" rx="60" ry="10" fill="#080206" opacity="0.8" />

            {/* Chubby Feet */}
            <ellipse cx="92" cy="208" rx="15" ry="9" fill={cream} stroke={ink} strokeWidth="3.6" />
            <ellipse cx="128" cy="208" rx="15" ry="9" fill={cream} stroke={ink} strokeWidth="3.6" />

            {/* Plump Mochi Body */}
            <path d="M82 135 C70 162 76 200 110 200 C144 200 150 162 138 135 Z" fill="url(#signMochiShine)" stroke={ink} strokeWidth="3.6" />

            {/* Head */}
            <circle cx="110" cy="85" r="42" fill="url(#signMochiShine)" stroke={ink} strokeWidth="3.6" />

            {/* Articulated Ears with Lifelike Reactivity */}
            <motion.g
              animate={
                buttonHover === 'no'
                  ? { rotate: -32, y: 4 }
                  : buttonHover === 'yes'
                  ? { rotate: [-16, -26, -16], y: -3 }
                  : { rotate: [-20, -24, -20] }
              }
              transition={{ duration: buttonHover === 'yes' ? 0.4 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '72px 56px' }}
            >
              <ellipse cx="72" cy="56" rx="11" ry="19" transform="rotate(-20 72 56)" fill={cream} stroke={ink} strokeWidth="3.6" />
              <ellipse cx="72" cy="56" rx="6" ry="12" transform="rotate(-20 72 56)" fill={innerEar} />
            </motion.g>

            <motion.g
              animate={
                buttonHover === 'no'
                  ? { rotate: 32, y: 4 }
                  : buttonHover === 'yes'
                  ? { rotate: [16, 26, 16], y: -3 }
                  : { rotate: [20, 24, 20] }
              }
              transition={{ duration: buttonHover === 'yes' ? 0.4 : 2.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '148px 56px' }}
            >
              <ellipse cx="148" cy="56" rx="11" ry="19" transform="rotate(20 148 56)" fill={cream} stroke={ink} strokeWidth="3.6" />
              <ellipse cx="148" cy="56" rx="6" ry="12" transform="rotate(20 148 56)" fill={innerEar} />
            </motion.g>

            {/* Glowing Blushing Cheeks with Subtle Pulse */}
            <motion.ellipse
              animate={{
                scale: buttonHover === 'yes' ? [1, 1.2, 1] : [1, 1.06, 1],
                opacity: buttonHover === 'no' ? 0.65 : 0.9,
              }}
              transition={{ duration: 1.8, repeat: Infinity }}
              cx="75"
              cy="99"
              rx="9"
              ry="6"
              fill="url(#signBlushGlow)"
            />
            <motion.ellipse
              animate={{
                scale: buttonHover === 'yes' ? [1, 1.2, 1] : [1, 1.06, 1],
                opacity: buttonHover === 'no' ? 0.65 : 0.9,
              }}
              transition={{ duration: 1.8, repeat: Infinity }}
              cx="145"
              cy="99"
              rx="9"
              ry="6"
              fill="url(#signBlushGlow)"
            />

            {/* ============================================================ */}
            {/* LIVING ANIME PLEADING EYES RIG: Gaze, Blink, Shimmer & Pulse */}
            {/* ============================================================ */}

            {/* LEFT EYE */}
            <g transform={`translate(${effectiveGazeX}, ${effectiveGazeY})`}>
              <motion.g
                animate={{
                  scaleY: isBlinking ? 0.08 : 1,
                  scale: buttonHover === 'no' ? 1.15 : buttonHover === 'yes' ? 1.05 : 1,
                }}
                transition={{
                  scaleY: { duration: 0.08 },
                  scale: { type: 'spring', stiffness: 300, damping: 20 },
                }}
                style={{ transformOrigin: '92px 84px' }}
              >
                {/* Deep Obsidian Iris */}
                <ellipse cx="92" cy="84" rx="14" ry="18" fill="url(#signIrisGlow)" stroke={ink} strokeWidth="2.6" />
                <ellipse cx="92" cy="84" rx="12" ry="16" fill="none" stroke="#e879f9" strokeWidth="0.5" opacity="0.3" />

                {/* Watery Teardrop Sheen when hovering NO */}
                {buttonHover === 'no' && (
                  <motion.ellipse
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: [0.85, 1, 0.85], scaleY: [1, 1.15, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    cx="92"
                    cy="95"
                    rx="10"
                    ry="4.5"
                    fill="#74c0fc"
                    opacity="0.9"
                  />
                )}

                {/* Glassy Upper Tear Sheen */}
                <motion.path
                  animate={{ opacity: [0.35, 0.75, 0.35] }}
                  transition={{ duration: 2.6, repeat: Infinity }}
                  d="M83 80 C86 73 98 73 101 80"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Primary Bouncing Specular Glint */}
                <motion.circle
                  animate={{ scale: [1, 1.16, 1], opacity: [0.92, 1, 0.92] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  cx="87"
                  cy="76"
                  r="5.8"
                  fill="#ffffff"
                />

                {/* Secondary Star Sparkle Highlight */}
                <motion.g
                  animate={{ rotate: [-10, 10, -10], scale: [0.9, 1.12, 0.9] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '98px 89px' }}
                >
                  <circle cx="98" cy="89" r="2.8" fill="#ffffff" />
                  <path d="M98 85 L99 89 L102 89 L99.5 90.5 L100.5 93 L98 91.5 L95.5 93 L96.5 90.5 L94 89 L97 89 Z" fill="#ffffff" opacity="0.9" />
                </motion.g>

                {/* Micro Sparkle Pinpoint */}
                <circle cx="85" cy="89" r="1.5" fill="#ffffff" opacity="0.85" />

                {/* Double-Beat "Lub-Dub" Heart Reflection */}
                <motion.path
                  animate={
                    buttonHover === 'no'
                      ? { scale: [1, 1.25, 1.05, 1.32, 1], x: [-1, 1, -1] }
                      : { scale: [1, 1.28, 1.06, 1.34, 1] }
                  }
                  transition={{
                    duration: 1.25,
                    repeat: Infinity,
                    times: [0, 0.2, 0.36, 0.56, 1],
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: '93px 91px' }}
                  d="M93 87 C93 85 96 85 96 87 C96 89.5 93 91 93 91 C93 91 90 89.5 90 87 C90 85 93 85 93 87 Z"
                  fill="url(#signHeartGrad)"
                  filter="drop-shadow(0 0 2.5px rgba(255,42,133,0.85))"
                />
              </motion.g>
            </g>

            {/* RIGHT EYE */}
            <g transform={`translate(${effectiveGazeX}, ${effectiveGazeY})`}>
              <motion.g
                animate={{
                  scaleY: isBlinking ? 0.08 : 1,
                  scale: buttonHover === 'no' ? 1.15 : buttonHover === 'yes' ? 1.05 : 1,
                }}
                transition={{
                  scaleY: { duration: 0.08 },
                  scale: { type: 'spring', stiffness: 300, damping: 20 },
                }}
                style={{ transformOrigin: '128px 84px' }}
              >
                {/* Deep Obsidian Iris */}
                <ellipse cx="128" cy="84" rx="14" ry="18" fill="url(#signIrisGlow)" stroke={ink} strokeWidth="2.6" />
                <ellipse cx="128" cy="84" rx="12" ry="16" fill="none" stroke="#e879f9" strokeWidth="0.5" opacity="0.3" />

                {/* Watery Teardrop Sheen when hovering NO */}
                {buttonHover === 'no' && (
                  <motion.ellipse
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: [0.85, 1, 0.85], scaleY: [1, 1.15, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    cx="128"
                    cy="95"
                    rx="10"
                    ry="4.5"
                    fill="#74c0fc"
                    opacity="0.9"
                  />
                )}

                {/* Glassy Upper Tear Sheen */}
                <motion.path
                  animate={{ opacity: [0.35, 0.75, 0.35] }}
                  transition={{ duration: 2.6, repeat: Infinity }}
                  d="M119 80 C122 73 134 73 137 80"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Primary Bouncing Specular Glint */}
                <motion.circle
                  animate={{ scale: [1, 1.16, 1], opacity: [0.92, 1, 0.92] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  cx="123"
                  cy="76"
                  r="5.8"
                  fill="#ffffff"
                />

                {/* Secondary Star Sparkle Highlight */}
                <motion.g
                  animate={{ rotate: [-10, 10, -10], scale: [0.9, 1.12, 0.9] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '134px 89px' }}
                >
                  <circle cx="134" cy="89" r="2.8" fill="#ffffff" />
                  <path d="M134 85 L135 89 L138 89 L135.5 90.5 L136.5 93 L134 91.5 L131.5 93 L132.5 90.5 L130 89 L133 89 Z" fill="#ffffff" opacity="0.9" />
                </motion.g>

                {/* Micro Sparkle Pinpoint */}
                <circle cx="121" cy="89" r="1.5" fill="#ffffff" opacity="0.85" />

                {/* Double-Beat "Lub-Dub" Heart Reflection */}
                <motion.path
                  animate={
                    buttonHover === 'no'
                      ? { scale: [1, 1.25, 1.05, 1.32, 1], x: [-1, 1, -1] }
                      : { scale: [1, 1.28, 1.06, 1.34, 1] }
                  }
                  transition={{
                    duration: 1.25,
                    repeat: Infinity,
                    times: [0, 0.2, 0.36, 0.56, 1],
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: '129px 91px' }}
                  d="M129 87 C129 85 132 85 132 87 C132 89.5 129 91 129 91 C129 91 126 89.5 126 87 C126 85 129 85 129 87 Z"
                  fill="url(#signHeartGrad)"
                  filter="drop-shadow(0 0 2.5px rgba(255,42,133,0.85))"
                />
              </motion.g>
            </g>

            {/* ============================================================ */}
            {/* REACTIVE EYEBROWS & ADORABLE MOUTH                           */}
            {/* ============================================================ */}
            {buttonHover === 'no' ? (
              // Sad Inward Eyebrows & Trembling Pout
              <>
                <path d="M80 67 Q88 72 98 67" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
                <path d="M122 67 Q132 72 140 67" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
                <motion.path
                  animate={{ y: [0, -1, 0] }}
                  transition={{ duration: 0.14, repeat: Infinity }}
                  d="M105 106 Q110 102 115 106"
                  stroke={ink}
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : buttonHover === 'yes' ? (
              // Happy Raised Eyebrows & Excited Smile
              <>
                <path d="M82 63 Q90 58 98 63" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
                <path d="M122 63 Q130 58 138 63" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
                <path d="M105 104 Q110 112 115 104" fill="#ff4d88" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
              </>
            ) : (
              // Innocent Raised Pleading Eyebrows & Ultra-Cute Kitten Mouth :3
              <>
                <path d="M82 64 Q90 60 98 64" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
                <path d="M122 64 Q130 60 138 64" stroke={ink} strokeWidth="2.6" strokeLinecap="round" />
                <path d="M105 105 Q107.5 107.5 110 105.5 Q112.5 107.5 115 105" stroke={ink} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </>
            )}

            {/* ============================================================ */}
            {/* TACTILE PLACARD SIGNBOARD (100% CONTAINED TEXT, ZERO OVERFLOW) */}
            {/* ============================================================ */}
            <g>
              {/* Soft Drop Shadow behind placard */}
              <rect x="36" y="133" width="148" height="60" rx="12" fill="#0c0309" opacity="0.6" />

              {/* Placard Board Body */}
              <rect
                x="36"
                y="131"
                width="148"
                height="60"
                rx="12"
                fill="#fdfbf7"
                stroke="#ff7da7"
                strokeWidth="2.8"
              />

              {/* Subtle Inner Border Trim */}
              <rect
                x="40"
                y="135"
                width="140"
                height="52"
                rx="8"
                fill="none"
                stroke="#ffd4e3"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />

              {/* Decorative Corner Washi Tape Tabs */}
              <rect x="42" y="129" width="16" height="6" rx="2" fill="#ff6596" opacity="0.8" transform="rotate(-6 42 129)" />
              <rect x="162" y="129" width="16" height="6" rx="2" fill="#fcc2d7" opacity="0.8" transform="rotate(6 162 129)" />

              {/* Centered Placard Typography: Line 1 & Line 2 */}
              <text
                x="110"
                y="155"
                textAnchor="middle"
                fill="#5c0e24"
                fontFamily="'Gaegu', 'Caveat', cursive"
                fontSize="18"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                Pretty please?
              </text>

              <text
                x="110"
                y="175"
                textAnchor="middle"
                fill="#ff4d88"
                fontFamily="'Gaegu', 'Caveat', cursive"
                fontSize="15"
                fontWeight="bold"
              >
                ♡ say yes bb ♡
              </text>
            </g>

            {/* Chubby Paws Firmly Clutching Placard Edges */}
            <g>
              {/* Left Paw */}
              <circle cx="45" cy="161" r="8.5" fill={cream} stroke={ink} strokeWidth="3" />
              <circle cx="43" cy="159" r="2" fill="#ff7da7" opacity="0.75" />
              <circle cx="47" cy="159" r="2" fill="#ff7da7" opacity="0.75" />
              <ellipse cx="45" cy="164" rx="3.5" ry="2.2" fill="#ff7da7" opacity="0.75" />

              {/* Right Paw */}
              <circle cx="175" cy="161" r="8.5" fill={cream} stroke={ink} strokeWidth="3" />
              <circle cx="173" cy="159" r="2" fill="#ff7da7" opacity="0.75" />
              <circle cx="177" cy="159" r="2" fill="#ff7da7" opacity="0.75" />
              <ellipse cx="175" cy="164" rx="3.5" ry="2.2" fill="#ff7da7" opacity="0.75" />
            </g>
          </svg>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 6. POSE: HUG HEART (Chapter 08 Celebration)
  // --------------------------------------------------------------------------
  return (
    <div
      className={`relative flex items-center justify-center select-none cursor-pointer group ${className}`}
      onClick={handlePokeClick}
      onPointerMove={handlePointerStroke}
    >
      {/* Floating Hearts */}
      <AnimatePresence>
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, scale: 0.6, x: h.x, y: 0 }}
            animate={{ opacity: 0, scale: 1.2, x: h.x * 1.6, y: -70 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute pointer-events-none text-roseGlow font-sans text-xl z-30 font-bold"
          >
            ♡
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hover / Petting Hint */}
      <div
        className={`absolute -top-7 transition-all bg-[#faf6f0] text-[#7a1631] font-doodle text-xs px-2.5 py-0.5 rounded-full border border-pink-300 shadow-sm pointer-events-none whitespace-nowrap ${
          isBeingPetted ? 'opacity-100 scale-105 bg-pink-100 border-pink-400' : 'opacity-0 group-hover:opacity-90'
        }`}
      >
        {isBeingPetted ? 'purrrrr... ♡' : 'pet me! ♡'}
      </div>

      <motion.div
        animate={
          isBeingPetted
            ? { scaleX: [1.06, 1.12, 1.06], scaleY: [0.9, 0.84, 0.9], y: [0, 6, 0] }
            : isPoked
            ? { scaleX: 1.2, scaleY: 0.84, y: 8 }
            : { scale: [1, 1.05, 1], y: [0, -5, 0] }
        }
        transition={{ duration: isBeingPetted ? 0.9 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-60 h-64 sm:w-68 sm:h-74"
      >
        <svg viewBox="0 0 230 230" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-[0_12px_32px_rgba(255,42,133,0.5)]">
          <defs>
            <linearGradient id="beatingHeartGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d88" />
              <stop offset="50%" stopColor="#d6336c" />
              <stop offset="100%" stopColor="#8f1d40" />
            </linearGradient>
          </defs>

          {/* Huge Beating Heart */}
          <motion.path
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '115px 115px' }}
            d="M115 55 C100 22 52 24 52 70 C52 112 115 155 115 155 C115 155 178 112 178 70 C178 24 130 22 115 55 Z"
            fill="url(#beatingHeartGlow)"
            stroke={ink}
            strokeWidth="3.8"
          />

          {/* Joyful Mochi Mascot Hugging from the Right */}
          <circle cx="145" cy="90" r="36" fill={cream} stroke={ink} strokeWidth="3.6" />
          <ellipse cx="170" cy="64" rx="10" ry="15" transform="rotate(22 170 64)" fill={cream} stroke={ink} strokeWidth="3.6" />
          <ellipse cx="170" cy="64" rx="5" ry="9" transform="rotate(22 170 64)" fill={innerEar} />

          {/* Squeezed Joyful Happy Eyes ^ ^ */}
          <path d="M130 86 Q137 78 144 86" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M150 86 Q157 78 164 86" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />

          <ellipse cx="138" cy="96" rx="8" ry="5" fill={blush} opacity="0.85" />
          <ellipse cx="160" cy="96" rx="8" ry="5" fill={blush} opacity="0.85" />

          {/* Tight Hugging Paws Wrapping Around Heart */}
          <path d="M148 112 C122 118 96 100 84 90" stroke={ink} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <circle cx="82" cy="90" r="7" fill={cream} stroke={ink} strokeWidth="3.2" />
        </svg>
      </motion.div>
    </div>
  );
};
