import {createHash} from "node:crypto";
import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";
import type {RecordingVariant} from "@flashcards/shared/audio/RecordingVariant";

interface Naming {
  readonly language: SpokenLanguage;
  readonly variant: RecordingVariant;
  readonly text: string;
  readonly voiceName: string;
  readonly rate: string;
}

const HASH_LENGTH = 16;

/**
 * Bumped when the speech markup changes how every recording sounds, so each gets a new name: a device keeps a recording for good under its
 * name (`immutable`), and would never fetch the new one otherwise. 2: no added silence before or after the speech.
 */
const SPEECH_MARKUP_REVISION = 2;

/**
 * The path under `audio/` of a recording: `ko/female-slower/<hash>.mp3`. The hash is of the text, the voice's name and the
 * rate, and the speech markup revision, so a changed word, voice, rate or revision is a new file and an unchanged one is never made twice. The folder says which
 * variant it is, so a spec can tell without recomputing a hash.
 */
export function recordingFileOf({language, variant, text, voiceName, rate}: Naming): string {
  const hash = createHash("sha256")
    .update(`${text}\n${voiceName}\n${rate}\n${SPEECH_MARKUP_REVISION}`)
    .digest("hex")
    .slice(0, HASH_LENGTH);

  return `${language}/${variant}/${hash}.mp3`;
}
