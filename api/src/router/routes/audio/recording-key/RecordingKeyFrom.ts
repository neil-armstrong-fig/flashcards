const RECORDING_NAME = /^(ko|ja|nl|en|music)\/[a-z]+-[a-z]+\/[0-9a-f]{16}\.mp3$/;

/**
 * The key of a recording in the bucket, or `undefined` where the name is not one the app makes: a language, a voice and speed, and
 * the sixteen-digit hash of the text (`tools/`). Nothing else is ever looked up, so a name cannot walk out of the folder or ask
 * for a file the bucket holds for another reason.
 */
export function recordingKeyFrom(name: string): string | undefined {
  if (!RECORDING_NAME.test(name)) {
    return undefined;
  }

  return name;
}
