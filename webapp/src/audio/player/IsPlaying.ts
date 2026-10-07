import {playerState} from "@src/audio/player/utils/PlayerState";

/** Whether a recording is sounding now. */
export function isPlaying(): boolean {
  return playerState.playing;
}
