import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  // 1. Dual side cannon bursts via canvas-confetti
  const count = 200;
  const defaults = {
    origin: { y: 0.8 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Left cannon
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.9 },
    colors: ['#38BDF8', '#FBBF24', '#F472B6', '#34D399', '#A78BFA'],
  });

  // Right cannon
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.9 },
    colors: ['#38BDF8', '#FBBF24', '#F472B6', '#34D399', '#A78BFA'],
  });

  // Staggered starburst
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
