import type {AzureVoice} from "@flashcards/shared/audio/azure/AzureVoice";
import type {Language} from "@flashcards/shared/language/Language";
import type {Voice} from "@flashcards/shared/audio/Voice";

/**
 * The voice behind each choice the learner has, per language, chosen by ear (`docs/audio.md`). Dutch is the Netherlands
 * voices, not the Belgian ones.
 */
export const AZURE_VOICES: Record<Language, Record<Voice, AzureVoice>> = {
  ko: {
    female: {name: "ko-KR-JiMinNeural", locale: "ko-KR"},
    male: {name: "ko-KR-BongJinNeural", locale: "ko-KR"},
  },
  ja: {
    female: {name: "ja-JP-MayuNeural", locale: "ja-JP"},
    male: {name: "ja-JP-NaokiNeural", locale: "ja-JP"},
  },
  nl: {
    female: {name: "nl-NL-FennaNeural", locale: "nl-NL"},
    male: {name: "nl-NL-MaartenNeural", locale: "nl-NL"},
  },
};
