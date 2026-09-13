import { useState, useEffect, useCallback } from 'react';

export interface GyroOrientation {
  tiltX: number; // -1 to 1 based on gamma (left/right)
  tiltY: number; // -1 to 1 based on beta (front/back)
  isAvailable: boolean;
}

/**
 * Native Mobile Haptic Feedback helper
 */
export const triggerHaptic = (pattern: number | number[] = 50) => {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // ignore if blocked by browser policy
  }
};

/**
 * Mobile Gyroscope Parallax Sensor Hook
 * Listens to deviceorientation events and smoothly maps tilt angles to [-1, 1]
 */
export const useGyroscope = (): GyroOrientation => {
  const [orientation, setOrientation] = useState<GyroOrientation>({
    tiltX: 0,
    tiltY: 0,
    isAvailable: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
      return;
    }

    let isSubscribed = true;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!isSubscribed) return;
      // gamma: [-90, 90] left to right
      // beta:  [-180, 180] front to back
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 0;

      // Normalize gamma to [-1, 1] with clamp at +/- 30 degrees
      const clampedGamma = Math.max(-30, Math.min(30, gamma));
      const tiltX = clampedGamma / 30;

      // Normalize beta to [-1, 1] around 45 degree viewing angle
      const clampedBeta = Math.max(15, Math.min(75, beta)) - 45;
      const tiltY = clampedBeta / 30;

      setOrientation({
        tiltX,
        tiltY,
        isAvailable: true,
      });
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    return () => {
      isSubscribed = false;
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return orientation;
};
