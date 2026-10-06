import {fileURLToPath} from "node:url";

/** What one run of a tool knows for as long as it lasts: where its files are, what it may send, and when it last asked Azure. */
interface Runtime {
  /** Where the recordings are kept: git-ignored, so the recordings never reach the repository or the public site. */
  audioFolder: string;
  manifestFile: string;
  /** The free tier allows 20 requests a minute: one every three seconds is 20, so a little more leaves room (`docs/audio.md`). */
  requestIntervalMs: number;
  /** Read from the environment by the command that needs them, and never printed. */
  region: string;
  key: string;
  /** When the last request to Azure began, in milliseconds. */
  lastRequestAt: number | undefined;
}

/** A process starts, does its work and ends, so its state is one object: commands fill it in, effects read it, a test sets it. */
export const runtime: Runtime = {
  audioFolder: fileURLToPath(new URL("../../../private-source/recordings/", import.meta.url)),
  manifestFile: fileURLToPath(new URL("../../../content/src/audio/recordings.json", import.meta.url)),
  requestIntervalMs: 3_300,
  region: "",
  key: "",
  lastRequestAt: undefined,
};
