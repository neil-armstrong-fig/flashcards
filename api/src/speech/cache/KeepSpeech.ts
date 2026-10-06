import {workerEnvironment} from "@src/env/WorkerEnvironment";

/** Keeps a recording Azure made under `key`, so asking for the same one again costs nothing. No expiry: a recording of a word does not go stale. */
export async function keepSpeech(key: string, audio: ArrayBuffer): Promise<void> {
  await workerEnvironment.SPEECH_AUDIO.put(key, audio);
}
