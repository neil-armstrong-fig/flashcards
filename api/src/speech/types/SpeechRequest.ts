import type {Speed} from "@flashcards/shared/audio/Speed";
import type {VoicedLanguage} from "@flashcards/shared/language/VoicedLanguage";
import type {Voice} from "@flashcards/shared/audio/Voice";

/**
 * What a caller may ask for: some Korean in one of the voices and speeds the app offers, or an English meaning, which has the one
 * voice at normal speed (so for English `voice` and `speed` are always those).
 */
export interface SpeechRequest {
  readonly language: VoicedLanguage;
  readonly text: string;
  readonly voice: Voice;
  readonly speed: Speed;
}
