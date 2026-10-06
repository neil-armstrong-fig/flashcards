import {BASIC_KANA} from "@flashcards/content/japanese/kana-table/BasicKana";
import {COMBINED_KANA} from "@flashcards/content/japanese/kana-table/CombinedKana";
import {VOICED_KANA} from "@flashcards/content/japanese/kana-table/VoicedKana";

/** One basic kana sound in the three forms a learner meets it in: Latin letters, hiragana and katakana. */
export interface Kana {
  readonly romaji: string;
  readonly hiragana: string;
  readonly katakana: string;
}

/** Every kana a learner meets: the basic ones, then those with dakuten, then the combined ones. */
export const KANA: readonly Kana[] = [...BASIC_KANA, ...VOICED_KANA, ...COMBINED_KANA];
