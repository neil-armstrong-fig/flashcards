import {createHash} from "node:crypto";
import type {SpokenLanguage} from "@language-learning/shared/language/SpokenLanguage";
import type {RecordingVariant} from "@language-learning/shared/audio/RecordingVariant";

interface Naming {
  readonly language: SpokenLanguage;
  readonly variant: RecordingVariant;
  readonly text: string;
  readonly voiceName: string;
  readonly rate: string;
}

const HASH_LENGTH = 16;

/**
 * The path under `audio/` of a recording: `ko/female-slower/<hash>.mp3`. The hash is of the text, the voice's name and the
 * rate, so a changed word, voice or rate is a new file and an unchanged one is never made twice. The folder says which
 * variant it is, so a spec can tell without recomputing a hash.
 */
export function recordingFileOf({language, variant, text, voiceName, rate}: Naming): string {
  const hash = createHash("sha256").update(`${text}\n${voiceName}\n${rate}`).digest("hex").slice(0, HASH_LENGTH);

  return `${language}/${variant}/${hash}.mp3`;
}
