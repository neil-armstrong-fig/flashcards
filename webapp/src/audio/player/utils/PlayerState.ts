interface PlayerState {
  /** The one audio element for the life of the app. Reusing it matters on a phone: a browser lets an element that a tap has started carry on playing later without another tap, which a fresh element each time would not. */
  element: HTMLAudioElement | undefined;
  /** Which request to play is the newest, so one still waiting for its recording is cut off by the next. */
  latest: number;
  /** Whether a recording is sounding now, for the screen to show. */
  playing: boolean;
  /** How many recordings have been started, so the screen can show each start, even one that follows straight after another. */
  started: number;
  /** Who is waiting to hear that `playing` changed. */
  listeners: Set<() => void>;
}

export const playerState: PlayerState = {
  element: undefined,
  latest: 0,
  playing: false,
  started: 0,
  listeners: new Set(),
};
