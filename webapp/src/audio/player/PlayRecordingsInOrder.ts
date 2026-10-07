import {playRecording} from "@src/audio/player/PlayRecording";
import {readyTheNext} from "@src/audio/player/utils/ReadyTheNext";

/**
 * Plays each recording to its end, one after the other, so two can be heard side by side. While the first plays the rest are
 * fetched and loaded, so the next starts the moment it ends and the pause between them is only what the recordings hold. Never throws.
 */
export function playRecordingsInOrder(urls: readonly string[]): void {
  const [first, ...rest] = urls;

  if (first === undefined) {
    return;
  }

  void readyTheNext(rest);
  playRecording(first, () => playRecordingsInOrder(rest));
}
