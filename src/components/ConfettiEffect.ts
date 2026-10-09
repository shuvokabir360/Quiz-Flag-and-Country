import confetti from 'canvas-confetti';

export function triggerConfettiBurst(streak = 1) {
  try {
    const particleCount = streak >= 5 ? 85 : 45;
    const spread = streak >= 5 ? 80 : 60;

    confetti({
      particleCount,
      spread,
      origin: { y: 0.6 },
      colors: ['#10b981', '#38bdf8', '#fbbf24', '#f43f5e', '#a855f7'],
      disableForReducedMotion: true,
      zIndex: 10000,
    });
  } catch {
    // ignore
  }
}
