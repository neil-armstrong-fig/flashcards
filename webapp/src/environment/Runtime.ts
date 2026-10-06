import {AUDIO_RECORDINGS} from "@flashcards/content/audio/AudioRecordings";
import type {AudioManifest} from "@flashcards/content/audio/types/AudioManifest";

interface Runtime {
  /** Where the API runs: `wrangler dev` by default, and the deployed Worker when the build is given its address. */
  apiOrigin: string;
  /** The recordings there are to speak. */
  audioRecordings: AudioManifest;
}

/** What the app knows for as long as the page lives and that no learner's action changes. A test sets what it needs. */
export const runtime: Runtime = {
  apiOrigin: import.meta.env.VITE_API_ORIGIN ?? "http://localhost:8787",
  audioRecordings: AUDIO_RECORDINGS,
};
