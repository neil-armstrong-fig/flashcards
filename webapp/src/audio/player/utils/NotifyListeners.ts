import {playerState} from "@src/audio/player/utils/PlayerState";

/** Tells whoever is watching the player that something about it changed. */
export function notifyListeners(): void {
  for (const listener of playerState.listeners) {
    listener();
  }
}
