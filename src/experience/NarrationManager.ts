const naturalVoicePattern =
  /natural|neural|aria|jenny|guy|samantha|daniel|google uk english|google us english/i;
const calmMaleVoicePattern = /guy|david|mark|daniel|george|ryan|male/i;

export const getPreferredNarrationVoice = () => {
  const voices = window.speechSynthesis?.getVoices?.() ?? [];
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));

  return (
    englishVoices.find(
      (voice) => naturalVoicePattern.test(voice.name) && calmMaleVoicePattern.test(voice.name),
    ) ??
    englishVoices.find((voice) => calmMaleVoicePattern.test(voice.name)) ??
    englishVoices.find((voice) => naturalVoicePattern.test(voice.name)) ??
    englishVoices[0] ??
    null
  );
};

export const createNarrationUtterance = (text: string, volume: number) => {
  const utterance = new SpeechSynthesisUtterance(text);
  const preferredVoice = getPreferredNarrationVoice();

  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.lang = preferredVoice?.lang ?? "en-US";
  utterance.pitch = 0.92;
  utterance.rate = 0.86;
  utterance.volume = Math.min(0.72, Math.max(0, volume) * 0.82);

  return utterance;
};
