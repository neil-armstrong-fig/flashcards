import {playerState} from "@src/audio/player/utils/PlayerState";

/** Calls `listener` whenever a recording starts or stops sounding. Returns the way to stop listening. */
export function subscribeToPlaying(listener: () => void): () => void {
  playerState.listeners.add(listener);

  return () => {
    playerState.listeners.delete(listener);
  };
}
