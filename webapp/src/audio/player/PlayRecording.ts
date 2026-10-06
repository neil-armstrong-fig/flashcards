import {ensureRecording} from "@src/audio/recordings/EnsureRecording";
import {playerState} from "@src/audio/player/utils/PlayerState";

const RECORDED_AHEAD = "audio/";

/**
 * Plays a recording, cutting off whatever was playing. A recording made ahead of time is first made sure of (fetched from the API
 * once, then kept on the device), and a newer request cuts off one still waiting for that. A recording the browser refuses is
 * reported and ignored, and the replay button is the learner's way round it. `onEnded` runs when it has played to its end. Never throws.
 */
export function playRecording(url: string, onEnded?: () => void): void {
  playerState.latest += 1;

  if (!url.startsWith(RECORDED_AHEAD)) {
    begin(url, onEnded);

    return;
  }

  const request = playerState.latest;

  void ensureRecording(url).then(() => {
    if (request === playerState.latest) {
      begin(url, onEnded);
    }
  });
}

function begin(url: string, onEnded: (() => void) | undefined): void {
  playerState.element ??= new Audio();

  const element = playerState.element;

  element.onended = onEnded ?? null;
  element.src = url;
  element.play().catch((error: unknown) => console.error("A recording could not be played.", error));
}
