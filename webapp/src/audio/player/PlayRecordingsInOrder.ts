import {playRecording} from "@src/audio/player/PlayRecording";

/** Plays each recording to its end, one after the other, so two can be heard side by side. Never throws. */
export function playRecordingsInOrder(urls: readonly string[]): void {
  const [first, ...rest] = urls;

  if (first === undefined) {
    return;
  }

  playRecording(first, () => playRecordingsInOrder(rest));
}
