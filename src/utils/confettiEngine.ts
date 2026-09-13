import confetti from 'canvas-confetti';

export const triggerCinematicCelebration = () => {
  // Act 1: Initial Central Heart & Stardust Burst
  confetti({
    particleCount: 140,
    spread: 120,
    origin: { y: 0.55 },
    colors: ['#ff2a85', '#ff7da7', '#ffffff', '#fef08a', '#fbcfe8'],
    scalar: 1.2,
    ticks: 240,
  });

  // Act 2: Left High-Velocity Cannon
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 55,
      spread: 70,
      origin: { x: 0, y: 0.65 },
      colors: ['#ff2a85', '#ffb6d9', '#ffffff'],
      scalar: 1.1,
    });
  }, 220);

  // Act 3: Right High-Velocity Cannon
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 125,
      spread: 70,
      origin: { x: 1, y: 0.65 },
      colors: ['#ff2a85', '#ffb6d9', '#ffffff'],
      scalar: 1.1,
    });
  }, 440);

  // Act 4: Champagne Gold & Rose Petal Shimmer Rain
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.2 },
      colors: ['#fef08a', '#ff7da7', '#ffffff'],
      gravity: 0.7,
      scalar: 0.9,
      drift: 0.1,
    });
  }, 800);
};
