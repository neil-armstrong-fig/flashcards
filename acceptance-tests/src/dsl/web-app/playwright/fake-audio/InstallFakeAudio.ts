import type {PlayedEntry} from "@src/dsl/web-app/types/PlayedEntry";

/** What the fake audio element keeps on the page for the DSL to read back. */
interface FakeAudio {
  readonly played: PlayedEntry[];
}

declare global {
  interface Window {
    fakeAudio: FakeAudio;
  }
}

/**
 * Runs in the page before the app does, and replaces what an audio element does when asked to play: it writes down where
 * it was asked to play from (`src`, not `currentSrc`, which still holds the last recording until the browser has switched over) and
 * looks for that address in the browser's caches, where the app keeps every recording it has fetched, so a recording the device does not
 * hold (one the API refused, or the network gone with nothing kept) shows as not found. No sound is made, so a spec never waits on one. It is
 * serialised into the page, so it uses nothing from this file.
 */
export function installFakeAudio(): void {
  const played: PlayedEntry[] = [];

  window.fakeAudio = {played};

  HTMLMediaElement.prototype.play = function play(this: HTMLMediaElement): Promise<void> {
    const entry: PlayedEntry = {src: this.src};

    played.push(entry);
    caches
      .match(entry.src)
      .then(response => {
        entry.found = response !== undefined;
      })
      .catch(() => {
        entry.found = false;
      });

    // A real element says when it has finished, which is what lets two recordings play one after the other.
    queueMicrotask(() => this.dispatchEvent(new Event("ended")));

    return Promise.resolve();
  };
}
