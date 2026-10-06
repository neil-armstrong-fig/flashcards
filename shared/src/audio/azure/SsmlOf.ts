import type {SsmlSubject} from "@language-learning/shared/audio/azure/SsmlSubject";

/** The SSML Azure is asked to speak: the text in the voice, wrapped in a prosody rate unless the rate is the default. */
export function ssmlOf({text, voiceName, locale, rate}: SsmlSubject): string {
  const spoken = escapeXml(text);

  if (rate === "default") {
    return speak(locale, voiceName, spoken);
  }

  return speak(locale, voiceName, `<prosody rate="${rate}">${spoken}</prosody>`);
}

function speak(locale: string, voiceName: string, inner: string): string {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}"><voice name="${voiceName}">${inner}</voice></speak>`;
}

function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
