/** The most characters the romanisation of a card may have. */
export const MAX_ROMANISATION_CHARACTERS = 40;

// Plain Latin letters, with spaces and hyphens between them: the Revised Romanization of Korean needs nothing more.
const ROMANISATION = /^[A-Za-z][A-Za-z -]*$/u;

/** A romanisation as it can be kept: trimmed, one to forty Latin letters. `undefined` for anything else. */
export function romanisationFrom(text: string): string | undefined {
  const trimmed = text.trim();

  if (trimmed.length === 0 || trimmed.length > MAX_ROMANISATION_CHARACTERS || !ROMANISATION.test(trimmed)) {
    return undefined;
  }

  return trimmed;
}
