/** The most characters the English meaning of a card may have. */
export const MAX_ENGLISH_MEANING_CHARACTERS = 40;

// Letters, with spaces, commas, apostrophes and hyphens between them. Nothing else.
const ENGLISH_MEANING = /^[A-Za-z][A-Za-z ,'’-]*$/u;

/** An English meaning as it can be kept and spoken: trimmed, one to forty characters. `undefined` for anything else. */
export function englishMeaningFrom(text: string): string | undefined {
  const trimmed = text.trim();

  if (trimmed.length === 0 || trimmed.length > MAX_ENGLISH_MEANING_CHARACTERS || !ENGLISH_MEANING.test(trimmed)) {
    return undefined;
  }

  return trimmed;
}
