import {BASIC_KANA} from "@flashcards/content/japanese/kana-table/BasicKana";
import {VOICED_KANA} from "@flashcards/content/japanese/kana-table/VoicedKana";
import type {Kana} from "@flashcards/content/japanese/Kana";

/** The kana worth learning first: the basic ones, then those with dakuten, which most words use. The combined ones come in decks of their own. */
export const CORE_KANA: readonly Kana[] = [...BASIC_KANA, ...VOICED_KANA];
