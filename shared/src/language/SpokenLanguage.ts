import type {Subject} from "@flashcards/shared/language/Subject";
import type {VoicedLanguage} from "@flashcards/shared/language/VoicedLanguage";

/** What the app plays aloud: whatever Azure speaks, and the notes of music. */
export type SpokenLanguage = VoicedLanguage | Extract<Subject, "music">;
