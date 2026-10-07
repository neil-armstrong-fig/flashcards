import {playerState} from "@src/audio/player/utils/PlayerState";

/** How many recordings the player has started since the app opened. */
export function countRecordingsStarted(): number {
  return playerState.started;
}
