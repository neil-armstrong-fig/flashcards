/** The most characters one similar word, or one request to the speech API, may have. A word, not a paragraph. */
export const MAX_KOREAN_WORD_CHARACTERS = 12;

// Hangul syllables, and the jamo blocks, with spaces between words. Nothing else.
const KOREAN_WORD = /^[가-힣ᄀ-ᇿ㄰-㆏ ]+$/u;

/** A Korean word as it can be asked for: trimmed, and only Korean, one to twelve characters. `undefined` for anything else. */
export function koreanWordFrom(text: string): string | undefined {
  const trimmed = text.trim();

  if (trimmed.length === 0 || trimmed.length > MAX_KOREAN_WORD_CHARACTERS || !KOREAN_WORD.test(trimmed)) {
    return undefined;
  }

  return trimmed;
}
