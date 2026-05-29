const naturalVoicePattern =
  /natural|neural|aria|jenny|guy|samantha|daniel|google uk english|google us english/i;

export const getPreferredNarrationVoice = () => {
  const voices = window.speechSynthesis?.getVoices?.() ?? [];
  return voices.find((voice) => naturalVoicePattern.test(voice.name)) ?? voices[0] ?? null;
};

export const createNarrationUtterance = (text: string, volume: number) => {
  const utterance = new SpeechSynthesisUtterance(text);
  const preferredVoice = getPreferredNarrationVoice();

  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.pitch = 0.92;
  utterance.rate = 0.86;
  utterance.volume = Math.min(0.72, Math.max(0, volume) * 0.82);

  return utterance;
};
