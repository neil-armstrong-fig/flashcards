import type {Language} from "@flashcards/shared/language/Language";

/** What Azure speaks: every language taught, and English, the language the cards ask their meanings in. Not the notes of music, which are generated tones. */
export type VoicedLanguage = Language | "en";
