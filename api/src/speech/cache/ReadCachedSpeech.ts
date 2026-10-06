import {workerEnvironment} from "@src/env/WorkerEnvironment";

/**
 * The recording kept under `key`, or undefined. Recordings live in Workers KV: shared by every Cloudflare location, durable, and free at
 * this size (each is about 11 KB; the free tier holds a gigabyte and allows a thousand writes a day).
 */
export async function readCachedSpeech(key: string): Promise<ArrayBuffer | undefined> {
  return (await workerEnvironment.SPEECH_AUDIO.get(key, "arrayBuffer")) ?? undefined;
}
