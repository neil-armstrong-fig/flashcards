import {mkdir, writeFile} from "node:fs/promises";
import {dirname} from "node:path";
import {runtime} from "@src/runtime/Runtime";

/** Keeps a recording under `audio/`, making its folder if it has none yet. */
export async function saveRecording(file: string, audio: Uint8Array): Promise<void> {
  await mkdir(dirname(`${runtime.audioFolder}${file}`), {recursive: true});
  await writeFile(`${runtime.audioFolder}${file}`, audio);
}
