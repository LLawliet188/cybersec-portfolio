import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Howl, Howler } from "howler";
import { useEnvironment } from "./EnvironmentProvider";
import { createNarrationUtterance } from "./NarrationManager";
import type { MissionId, MissionNode } from "./types";

type AudioManagerProps = {
  activeNarration?: MissionNode | null;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  volume: number;
};

type AudioApi = {
  enabled: boolean;
  playInterface: (type: InterfaceSound) => void;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
};

type InterfaceSound = "cancel" | "click" | "hold" | "hover" | "unlock";

const sceneAudioProfiles: Record<
  MissionId,
  {
    formant: number;
    shimmer: number;
    whisper: number;
  }
> = {
  arsenal: { formant: 1280, shimmer: 248, whisper: 1780 },
  boot: { formant: 920, shimmer: 176, whisper: 1460 },
  file: { formant: 1180, shimmer: 214, whisper: 1620 },
  identity: { formant: 1040, shimmer: 194, whisper: 1540 },
  operations: { formant: 760, shimmer: 138, whisper: 1220 },
  transmission: { formant: 1320, shimmer: 268, whisper: 1880 },
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
  volume,
}: AudioManagerProps) => {
  const { activationProgress, activeNode, intensity, mode, transitionProgress } =
    useEnvironment();
  const ambienceRef = useRef<{
    context: AudioContext;
    gain: GainNode;
    oscillatorA: OscillatorNode;
    oscillatorB: OscillatorNode;
    shimmerFilter: BiquadFilterNode;
    shimmerGain: GainNode;
    shimmerOscillator: OscillatorNode;
    filter: BiquadFilterNode;
    whisperFilter: BiquadFilterNode;
    whisperGain: GainNode;
    whisperSource: AudioBufferSourceNode;
  } | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const narrationRef = useRef<Howl | null>(null);

  const sounds = useMemo(
    () => ({
      cancel: new Howl({ src: [createTone(180, 0.12)], volume: 0.055 }),
      click: new Howl({ src: [createTone(520, 0.14)], volume: 0.08 }),
      hold: new Howl({ src: [createTone(260, 0.22)], volume: 0.07 }),
      hover: new Howl({ src: [createTone(820, 0.08)], volume: 0.035 }),
      unlock: new Howl({ src: [createTone(680, 0.32)], volume: 0.1 }),
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
    const whisperFilter = context.createBiquadFilter();
    const shimmerFilter = context.createBiquadFilter();
    const whisperGain = context.createGain();
    const shimmerGain = context.createGain();
    const oscillatorA = context.createOscillator();
    const oscillatorB = context.createOscillator();
    const shimmerOscillator = context.createOscillator();
    const whisperSource = context.createBufferSource();
    const whisperBuffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
    const whisperData = whisperBuffer.getChannelData(0);

    for (let index = 0; index < whisperData.length; index += 1) {
      const envelope = Math.sin((index / whisperData.length) * Math.PI);
      whisperData[index] = (Math.random() * 2 - 1) * envelope * 0.2;
    }

    oscillatorA.type = "sine";
    oscillatorB.type = "triangle";
    shimmerOscillator.type = "sine";
    oscillatorA.frequency.value = 44;
    oscillatorB.frequency.value = 91;
    shimmerOscillator.frequency.value = 176;
    filter.type = "lowpass";
    filter.frequency.value = 440;
    whisperFilter.type = "bandpass";
    whisperFilter.Q.value = 4.8;
    whisperFilter.frequency.value = 1460;
    shimmerFilter.type = "bandpass";
    shimmerFilter.Q.value = 8;
    shimmerFilter.frequency.value = 920;
    gain.gain.value = 0;
    whisperGain.gain.value = 0;
    shimmerGain.gain.value = 0;
    whisperSource.buffer = whisperBuffer;
    whisperSource.loop = true;

    oscillatorA.connect(filter);
    oscillatorB.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    whisperSource.connect(whisperFilter);
    whisperFilter.connect(whisperGain);
    whisperGain.connect(context.destination);
    shimmerOscillator.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(context.destination);
    oscillatorA.start();
    oscillatorB.start();
    shimmerOscillator.start();
    whisperSource.start();

    ambienceRef.current = {
      context,
      filter,
      gain,
      oscillatorA,
      oscillatorB,
      shimmerFilter,
      shimmerGain,
      shimmerOscillator,
      whisperFilter,
      whisperGain,
      whisperSource,
    };
    return ambienceRef.current;
  }, []);

  const playInterface = useCallback(
    (type: InterfaceSound) => {
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
    Howler.volume(Math.min(Math.max(volume, 0), 1));
    if (!enabled) {
      window.speechSynthesis?.cancel();
      const ambience = ambienceRef.current;
      if (ambience && ambience.context.state !== "closed") {
        const now = ambience.context.currentTime;
        ambience.gain.gain.setTargetAtTime(0, now, 0.5);
        ambience.whisperGain.gain.setTargetAtTime(0, now, 0.4);
        ambience.shimmerGain.gain.setTargetAtTime(0, now, 0.35);
      }
      return;
    }

    const ambience = ensureAmbience();
    void ambience.context.resume().catch(() => undefined);
  }, [enabled, ensureAmbience, volume]);

  useEffect(() => {
    if (!enabled || !ambienceRef.current || ambienceRef.current.context.state === "closed") {
      return;
    }

    const ambience = ambienceRef.current;
    const now = ambience.context.currentTime;
    const profile = sceneAudioProfiles[activeNode];
    const target =
      (mode === "idle" ? 0.004 : 0.008 + intensity * 0.016 + transitionProgress * 0.008) *
      volume;
    const whisperTarget =
      (0.0035 + transitionProgress * 0.005 + activationProgress * 0.012 + intensity * 0.006) *
      volume;
    const shimmerTarget =
      (0.0018 + activationProgress * 0.005 + (mode === "breach" ? 0.004 : 0.001)) *
      volume;
    ambience.gain.gain.setTargetAtTime(target, now, 0.4);
    ambience.whisperGain.gain.setTargetAtTime(whisperTarget, now, 0.55);
    ambience.shimmerGain.gain.setTargetAtTime(shimmerTarget, now, 0.45);
    ambience.filter.frequency.setTargetAtTime(
      mode === "breach" ? 860 : mode === "intelligence" ? 680 : 420,
      now,
      0.35,
    );
    ambience.whisperFilter.frequency.setTargetAtTime(
      profile.whisper + transitionProgress * 120,
      now,
      0.6,
    );
    ambience.shimmerFilter.frequency.setTargetAtTime(
      profile.formant + activationProgress * 260,
      now,
      0.55,
    );
    ambience.shimmerOscillator.frequency.setTargetAtTime(
      profile.shimmer + intensity * 24,
      now,
      0.55,
    );
    ambience.oscillatorA.frequency.setTargetAtTime(
      40 + intensity * 8 + transitionProgress * 6,
      now,
      0.5,
    );
    ambience.oscillatorB.frequency.setTargetAtTime(
      82 + intensity * 18 + transitionProgress * 10,
      now,
      0.5,
    );
  }, [activationProgress, activeNode, enabled, intensity, mode, transitionProgress, volume]);

  useEffect(() => {
    if (!enabled || !activeNarration) return;

    narrationRef.current?.stop();
    narrationRef.current?.unload();
    window.speechSynthesis?.cancel();
    const narration = new Howl({
      html5: true,
      onloaderror: () => {
        const utterance = createNarrationUtterance(activeNarration.narration, volume);
        utteranceRef.current = utterance;
        window.setTimeout(() => window.speechSynthesis?.speak(utterance), 180);
      },
      onplayerror: () => {
        const utterance = createNarrationUtterance(activeNarration.narration, volume);
        utteranceRef.current = utterance;
        window.setTimeout(() => window.speechSynthesis?.speak(utterance), 180);
      },
      src: [activeNarration.narrationSrc],
      volume: Math.min(0.82, volume * 0.92),
    });
    narrationRef.current = narration;
    narration.play();

    return () => {
      narration.stop();
      narration.unload();
      window.speechSynthesis?.cancel();
      utteranceRef.current = null;
      if (narrationRef.current === narration) narrationRef.current = null;
    };
  }, [activeNarration, enabled, volume]);

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
      narrationRef.current?.stop();
      narrationRef.current?.unload();
      window.speechSynthesis?.cancel();
      if (ambienceRef.current) {
        const ambience = ambienceRef.current;
        ambienceRef.current = null;
        try {
          ambience.oscillatorA.stop();
          ambience.oscillatorB.stop();
          ambience.shimmerOscillator.stop();
          ambience.whisperSource.stop();
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
