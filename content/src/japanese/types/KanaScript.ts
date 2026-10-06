export const KANA_SCRIPTS = ["hiragana", "katakana"] as const;

/** The two ways to write a kana sound. */
export type KanaScript = (typeof KANA_SCRIPTS)[number];
