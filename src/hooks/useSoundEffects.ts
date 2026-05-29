import { useCallback, useEffect, useRef, useState } from "react";

type SoundName = "enter" | "hover" | "click";

const frequencies: Record<SoundName, [number, number]> = {
  enter: [146.83, 440],
  hover: [880, 1174.66],
  click: [329.63, 659.25],
};

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    return () => {
      void audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, []);

  const ensureAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  const playSound = useCallback(
    (name: SoundName) => {
      if (!soundEnabledRef.current) return;

      const audioContext = ensureAudioContext();
      const now = audioContext.currentTime;
      const [base, overtone] = frequencies[name];
      const output = audioContext.createGain();

      output.gain.setValueAtTime(0.0001, now);
      output.gain.exponentialRampToValueAtTime(name === "enter" ? 0.08 : 0.028, now + 0.025);
      output.gain.exponentialRampToValueAtTime(0.0001, now + (name === "enter" ? 0.72 : 0.18));
      output.connect(audioContext.destination);

      [base, overtone].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const filter = audioContext.createBiquadFilter();

        oscillator.type = index === 0 ? "sine" : "triangle";
        oscillator.frequency.setValueAtTime(frequency, now);
        oscillator.frequency.exponentialRampToValueAtTime(
          frequency * (name === "enter" ? 0.72 : 1.08),
          now + (name === "enter" ? 0.7 : 0.16),
        );
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(name === "enter" ? 880 : 1600, now);
        oscillator.connect(filter);
        filter.connect(output);
        oscillator.start(now);
        oscillator.stop(now + (name === "enter" ? 0.76 : 0.2));
      });
    },
    [ensureAudioContext],
  );

  const toggleSound = useCallback(() => {
    ensureAudioContext();
    setSoundEnabled((enabled) => {
      soundEnabledRef.current = !enabled;
      return !enabled;
    });
  }, [ensureAudioContext]);

  const enableSound = useCallback(() => {
    ensureAudioContext();
    soundEnabledRef.current = true;
    setSoundEnabled(true);
  }, [ensureAudioContext]);

  return {
    enableSound,
    playSound,
    soundEnabled,
    toggleSound,
  };
};
