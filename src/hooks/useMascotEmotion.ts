import { useState, useEffect, useCallback, useRef } from 'react';
import { sound } from '../utils/audioEngine';

export interface MascotEmotionState {
  lookX: number; // -1 (left) to +1 (right)
  lookY: number; // -1 (up) to +1 (down)
  isBlinking: boolean;
  buttonHover: 'none' | 'yes' | 'no';
  isPoked: boolean;
  isBeingPetted: boolean;
  pokeCount: number;
  petCount: number;
  triggerPoke: () => void;
  triggerPet: () => void;
  setButtonHover: (state: 'none' | 'yes' | 'no') => void;
}

export const useMascotEmotion = (): MascotEmotionState => {
  const [lookPos, setLookPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [buttonHover, setButtonHover] = useState<'none' | 'yes' | 'no'>('none');
  const [isPoked, setIsPoked] = useState(false);
  const [isBeingPetted, setIsBeingPetted] = useState(false);
  const [pokeCount, setPokeCount] = useState(0);
  const [petCount, setPetCount] = useState(0);

  const pokeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const petTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Natural Involuntary Eye Blinking
  useEffect(() => {
    let blinkTimer: ReturnType<typeof setTimeout>;
    const scheduleNextBlink = () => {
      const delay = Math.random() * 3200 + 2200; // 2.2s - 5.4s
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 140);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimer);
  }, []);

  // 2. Real-Time Cursor Gaze Tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized direction relative to screen center
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      setLookPos({
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. Interactive Squishy Poke
  const triggerPoke = useCallback(() => {
    sound.playSqueak();
    setIsPoked(true);
    setPokeCount((c) => c + 1);

    if (pokeTimeoutRef.current) {
      clearTimeout(pokeTimeoutRef.current);
    }
    pokeTimeoutRef.current = setTimeout(() => {
      setIsPoked(false);
    }, 650);
  }, []);

  // 4. Interactive Petting & Purring
  const triggerPet = useCallback(() => {
    sound.playPurr();
    setIsBeingPetted(true);
    setPetCount((c) => c + 1);

    if (petTimeoutRef.current) {
      clearTimeout(petTimeoutRef.current);
    }
    petTimeoutRef.current = setTimeout(() => {
      setIsBeingPetted(false);
    }, 950);
  }, []);

  return {
    lookX: lookPos.x,
    lookY: lookPos.y,
    isBlinking,
    buttonHover,
    isPoked,
    isBeingPetted,
    pokeCount,
    petCount,
    triggerPoke,
    triggerPet,
    setButtonHover,
  };
};
