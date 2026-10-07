import {playRecordingsInOrder} from "@src/audio/player/PlayRecordingsInOrder";
import {testEnvironment} from "@src/testing/environment/TestEnvironment";
import {vi} from "vitest";

vi.unmock("@src/audio/player/PlayRecordingsInOrder");

class LoadingAudio {
  static readonly loaded: string[] = [];
  preload = "";
  src = "";
  onloadeddata: (() => void) | undefined;
  onerror: (() => void) | undefined;

  load(): void {
    LoadingAudio.loaded.push(this.src);
  }
}

it("fetches and loads the later recordings while the first is still playing, so none is waited for between them", async () => {
  LoadingAudio.loaded.length = 0;
  vi.stubGlobal("Audio", LoadingAudio);

  playRecordingsInOrder(["audio/ko/female-normal/water.mp3", "audio/ko/female-normal/fire.mp3"]);

  await vi.waitFor(() => expect(LoadingAudio.loaded).toEqual(["audio/ko/female-normal/fire.mp3"]));
  expect(testEnvironment.recordings.fetched).toEqual(["audio/ko/female-normal/fire.mp3"]);
  expect(testEnvironment.audio.played).toEqual(["audio/ko/female-normal/water.mp3"]);
});
