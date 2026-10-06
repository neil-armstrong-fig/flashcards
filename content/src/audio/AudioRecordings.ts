import recordings from "./recordings.json";
import type {AudioManifest} from "@language-learning/content/audio/types/AudioManifest";

/** The recordings the generator in `tools/` has made (`recordings.json` is its output: do not edit it by hand). */
export const AUDIO_RECORDINGS: AudioManifest = recordings;
