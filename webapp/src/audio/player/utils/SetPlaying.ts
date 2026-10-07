import {notifyListeners} from "@src/audio/player/utils/NotifyListeners";
import {playerState} from "@src/audio/player/utils/PlayerState";

/** Records whether a recording is sounding, and tells whoever is watching when that changed. */
export function setPlaying(playing: boolean): void {
  if (playerState.playing === playing) {
    return;
  }

  playerState.playing = playing;
  notifyListeners();
}
