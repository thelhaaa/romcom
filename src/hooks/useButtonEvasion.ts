import { useState, useCallback } from 'react';
import { Coordinates } from '../types';
import { sound } from '../utils/audioEngine';

export const useButtonEvasion = (boundX: number = 180, boundY: number = 120) => {
  const [position, setPosition] = useState<Coordinates>({ x: 0, y: 0 });
  const [isEvading, setIsEvading] = useState<boolean>(false);
  const [dodgeCount, setDodgeCount] = useState<number>(0);

  const dodge = useCallback(() => {
    sound.playWhoosh();
    setIsEvading(true);
    setDodgeCount((c) => c + 1);

    // Random jump away while keeping strictly inside container boundaries
    const randX = (Math.random() - 0.5) * boundX * 2;
    const randY = (Math.random() - 0.5) * boundY * 2;

    setPosition({ x: randX, y: randY });

    const timer = setTimeout(() => setIsEvading(false), 260);
    return () => clearTimeout(timer);
  }, [boundX, boundY]);

  const reset = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setDodgeCount(0);
    setIsEvading(false);
  }, []);

  return {
    position,
    isEvading,
    dodgeCount,
    dodge,
    reset,
  };
};
