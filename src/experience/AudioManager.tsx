import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Howl, Howler } from "howler";
import { useEnvironment } from "./EnvironmentProvider";
import type { MissionNode } from "./types";

type AudioManagerProps = {
  activeNarration?: MissionNode | null;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

type AudioApi = {
  enabled: boolean;
  playInterface: (type: "hover" | "click" | "hold") => void;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
};

export const createTone = (frequency: number, duration = 0.18) => {
  const sampleRate = 22050;
  const samples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, value: string) => {
    for (let index = 0; index < value.length; index += 1) {
      view.setUint8(offset + index, value.charCodeAt(index));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples * 2, true);

  for (let index = 0; index < samples; index += 1) {
    const envelope = Math.sin((index / samples) * Math.PI);
    const sample =
      Math.sin((2 * Math.PI * frequency * index) / sampleRate) *
      envelope *
      0.22;
    view.setInt16(44 + index * 2, sample * 32767, true);
  }

  let binary = "";
  const bytes = new Uint8Array(buffer);
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return `data:audio/wav;base64,${btoa(binary)}`;
};

const AudioManagerComponent = ({
  activeNarration,
  enabled,
  setEnabled,
}: AudioManagerProps) => {
  const { intensity, mode } = useEnvironment();
  const ambienceRef = useRef<{
    context: AudioContext;
    gain: GainNode;
    oscillatorA: OscillatorNode;
    oscillatorB: OscillatorNode;
    filter: BiquadFilterNode;
  } | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const sounds = useMemo(
    () => ({
      hover: new Howl({ src: [createTone(920, 0.11)], volume: 0.12 }),
      click: new Howl({ src: [createTone(420, 0.16)], volume: 0.18 }),
      hold: new Howl({ src: [createTone(128, 0.34)], volume: 0.22 }),
    }),
    [],
  );

  const ensureAmbience = useCallback(() => {
    if (ambienceRef.current && ambienceRef.current.context.state !== "closed") {
      return ambienceRef.current;
    }
    ambienceRef.current = null;

    const context = new AudioContext();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const oscillatorA = context.createOscillator();
    const oscillatorB = context.createOscillator();

    oscillatorA.type = "sawtooth";
    oscillatorB.type = "sine";
    oscillatorA.frequency.value = 38;
    oscillatorB.frequency.value = 74;
    filter.type = "lowpass";
    filter.frequency.value = 520;
    gain.gain.value = 0;

    oscillatorA.connect(filter);
    oscillatorB.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    oscillatorA.start();
    oscillatorB.start();

    ambienceRef.current = { context, filter, gain, oscillatorA, oscillatorB };
    return ambienceRef.current;
  }, []);

  const playInterface = useCallback(
    (type: "hover" | "click" | "hold") => {
      if (!enabled) return;
      sounds[type].stop();
      sounds[type].play();
    },
    [enabled, sounds],
  );

  const toggle = useCallback(() => {
    setEnabled(!enabled);
  }, [enabled, setEnabled]);

  useEffect(() => {
    Howler.mute(!enabled);
    if (!enabled) {
      window.speechSynthesis?.cancel();
      const ambience = ambienceRef.current;
      if (ambience && ambience.context.state !== "closed") {
        ambience.gain.gain.setTargetAtTime(
          0,
          ambience.context.currentTime,
          0.5,
        );
      }
      return;
    }

    const ambience = ensureAmbience();
    void ambience.context.resume().catch(() => undefined);
  }, [enabled, ensureAmbience]);

  useEffect(() => {
    if (!enabled || !ambienceRef.current || ambienceRef.current.context.state === "closed") {
      return;
    }

    const ambience = ambienceRef.current;
    const now = ambience.context.currentTime;
    const target = mode === "idle" ? 0.015 : 0.035 + intensity * 0.075;
    ambience.gain.gain.setTargetAtTime(target, now, 0.4);
    ambience.filter.frequency.setTargetAtTime(
      mode === "breach" ? 1280 : mode === "intelligence" ? 920 : 540,
      now,
      0.35,
    );
    ambience.oscillatorA.frequency.setTargetAtTime(38 + intensity * 18, now, 0.5);
    ambience.oscillatorB.frequency.setTargetAtTime(74 + intensity * 36, now, 0.5);
  }, [enabled, intensity, mode]);

  useEffect(() => {
    if (!enabled || !activeNarration) return;

    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(activeNarration.narration);
    utterance.pitch = 0.55;
    utterance.rate = 0.82;
    utterance.volume = 0.78;
    utteranceRef.current = utterance;
    window.speechSynthesis?.speak(utterance);

    return () => {
      window.speechSynthesis?.cancel();
      utteranceRef.current = null;
    };
  }, [activeNarration, enabled]);

  useEffect(() => {
    window.cyberAudio = {
      enabled,
      playInterface,
      setEnabled,
      toggle,
    };

    return () => {
      delete window.cyberAudio;
    };
  }, [enabled, playInterface, toggle]);

  useEffect(() => {
    return () => {
      Object.values(sounds).forEach((sound) => sound.unload());
      window.speechSynthesis?.cancel();
      if (ambienceRef.current) {
        const ambience = ambienceRef.current;
        ambienceRef.current = null;
        try {
          ambience.oscillatorA.stop();
          ambience.oscillatorB.stop();
        } catch {
          // The Strict Mode mount check can stop these once before the real mount.
        }
        if (ambience.context.state !== "closed") {
          void ambience.context.close().catch(() => undefined);
        }
      }
    };
  }, [sounds]);

  return null;
};

declare global {
  interface Window {
    cyberAudio?: AudioApi;
  }
}

export const AudioManager = memo(AudioManagerComponent);
