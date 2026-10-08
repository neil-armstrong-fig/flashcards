import {runtime} from "@src/runtime/Runtime";

/** One recording to put in the bucket: the key the app asks the API for, and the file that holds it. */
interface UploadEntry {
  readonly key: string;
  readonly file: string;
}

const RECORDING_PATH = /^(ko|ja|nl|en|music)\/[a-z]+-[a-z]+\/[0-9a-f]{16}\.mp3$/;

/** The pairs `wrangler r2 bulk put` takes, for the recordings among the files found under the recordings folder (paths relative to it). */
export function uploadListOf(relativePaths: readonly string[]): UploadEntry[] {
  return relativePaths
    .filter(path => RECORDING_PATH.test(path))
    .map(path => ({key: path, file: `${runtime.audioFolder}${path}`}));
}
