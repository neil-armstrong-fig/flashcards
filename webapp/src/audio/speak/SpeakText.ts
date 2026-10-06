import {audioUrlOf} from "@src/audio/speak/shared/utils/AudioUrlOf";
import {playRecording} from "@src/audio/player/PlayRecording";
import type {AudioChoices} from "@src/audio/types/AudioChoices";
import type {SpokenText} from "@flashcards/content/types/SpokenText";

/** Speaks the text, in the voice and at the speed chosen where its language has a choice. A text with no recording, in the manifest or kept, is silent. */
export function speakText(kept: readonly SpokenText[], spoken: SpokenText, choices: AudioChoices): void {
  const url = audioUrlOf(kept, {
    language: spoken.language,
    text: spoken.text,
    voice: choices.voice,
    speed: choices.speed,
  });

  if (url === undefined) {
    return;
  }

  playRecording(url);
}
