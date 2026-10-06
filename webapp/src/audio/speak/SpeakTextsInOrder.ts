import {audioUrlOf} from "@src/audio/speak/shared/utils/AudioUrlOf";
import {playRecordingsInOrder} from "@src/audio/player/PlayRecordingsInOrder";
import type {AudioChoices} from "@src/audio/types/AudioChoices";
import type {SpokenText} from "@flashcards/content/types/SpokenText";

/** Speaks each text one after the other, to hear them side by side. A text with no recording, in the manifest or kept, is skipped. */
export function speakTextsInOrder(
  kept: readonly SpokenText[],
  texts: readonly SpokenText[],
  choices: AudioChoices,
): void {
  const urls: string[] = [];

  for (const {language, text} of texts) {
    const url = audioUrlOf(kept, {language, text, voice: choices.voice, speed: choices.speed});

    if (url !== undefined) {
      urls.push(url);
    }
  }

  playRecordingsInOrder(urls);
}
