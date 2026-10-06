/** The learner's words by the note each is kept with, as the API keeps them. */
export type KeptWords = Readonly<Record<string, readonly string[]>>;

/** Whether something read from the API is words by note: an object of lists of strings. */
export function isKeptWords(value: unknown): value is KeptWords {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(texts => Array.isArray(texts) && texts.every(text => typeof text === "string"));
}
