import {SOUND_SIMILAR_GROUPS} from "@flashcards/content/japanese/sound-similars/SoundSimilarGroups";
import {KANA} from "@flashcards/content/japanese/Kana";
import type {Kana} from "@flashcards/content/japanese/Kana";

type Script = "hiragana" | "katakana";

/** The kana, in the script the card is in, that a kana is easily heard as, to listen to beside it. None for most. */
export function soundSimilarsOf(kana: Kana, script: Script): readonly string[] {
  const similars: string[] = [];

  for (const group of SOUND_SIMILAR_GROUPS) {
    if (!group.includes(kana.romaji)) {
      continue;
    }

    for (const romaji of group) {
      const other = KANA.find(entry => entry.romaji === romaji)?.[script];

      if (romaji !== kana.romaji && other !== undefined && !similars.includes(other)) {
        similars.push(other);
      }
    }
  }

  return similars;
}
