import {writeFile} from "node:fs/promises";
import {runtime} from "@src/runtime/Runtime";
import type {AudioManifest} from "@language-learning/content/audio/types/AudioManifest";

export async function writeManifest(manifest: AudioManifest): Promise<void> {
  await writeFile(runtime.manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
}
