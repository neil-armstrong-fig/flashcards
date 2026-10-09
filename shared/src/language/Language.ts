/** The languages the app teaches, by ISO 639-1 code. */
export const LANGUAGES = ["ko", "ja", "nl"] as const;

export type Language = (typeof LANGUAGES)[number];
