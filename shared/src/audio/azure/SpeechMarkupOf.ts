import type {SpeechMarkupSubject} from "@flashcards/shared/audio/azure/SpeechMarkupSubject";

/**
 * Azure adds about 1.2s of silence after a word and 0.2 to 0.4s before it, which made the gap between the two recordings of a
 * card long. `Leading-exact` and `Tailing-exact` set it to none (checked by ear, `docs/audio.md`).
 */
const NO_SILENCE = '<mstts:silence type="Leading-exact" value="0ms"/><mstts:silence type="Tailing-exact" value="0ms"/>';

/** The speech markup Azure is asked to speak: the text in the voice with no added silence, wrapped in a prosody rate unless the rate is the default. */
export function speechMarkupOf({text, voiceName, locale, rate}: SpeechMarkupSubject): string {
  const spoken = escapeXml(text);

  if (rate === "default") {
    return speak(locale, voiceName, spoken);
  }

  return speak(locale, voiceName, `<prosody rate="${rate}">${spoken}</prosody>`);
}

function speak(locale: string, voiceName: string, inner: string): string {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${locale}"><voice name="${voiceName}">${NO_SILENCE}${inner}</voice></speak>`;
}

function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
