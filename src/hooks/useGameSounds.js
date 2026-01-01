import { useCallback } from 'react';
import useSound from 'use-sound'; // Keeping the import if user wants real files later

// Simple Synth fallback since we don't have assets
const playSynth = (type) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'CORRECT') {
    // High ping
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  } else if (type === 'INCORRECT') {
    // Low buzz
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  } else if (type === 'BANK') {
    // Coins / Cha-chingish
    osc.type = 'square';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.setValueAtTime(1500, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'TIMEOUT') {
    // Alarm
    osc.type = 'square';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(300, now + 0.5);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
    osc.start(now);
    osc.stop(now + 1);
  } else if (type === 'WIN') {
    // Fanfare / Celebration
    // Arpeggio
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.2, now);

    // Note 1
    osc.frequency.setValueAtTime(523.25, now); // C5
    // Note 2
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    // Note 3
    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
    // Note 4
    osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    osc.start(now);
    osc.stop(now + 1.5);
  }
};

export const useGameSounds = () => {
  // If you used useSound, it would look like:
  // const [playCorrect] = useSound('/sounds/correct.mp3');

  const playCorrect = useCallback(() => playSynth('CORRECT'), []);
  const playIncorrect = useCallback(() => playSynth('INCORRECT'), []);
  const playBank = useCallback(() => playSynth('BANK'), []);
  const playTimeout = useCallback(() => playSynth('TIMEOUT'), []);

  const playIntro = useCallback(() => {
    const audio = new Audio('/sound_6825472f3fb43.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio play failed", e));
  }, []);

  return {
    playCorrect,
    playIncorrect,
    playBank,
    playTimeout,
    playWin: useCallback(() => playSynth('WIN'), []),
    playIntro
  };
};
