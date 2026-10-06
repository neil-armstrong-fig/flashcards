/** The languages the app teaches, by ISO 639-1 code. Dutch joins when its phase lands. */
export const LANGUAGES = ["ko", "ja"] as const;

export type Language = (typeof LANGUAGES)[number];
