import {execFile} from "node:child_process";
import {mkdtemp, readdir, rm, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {promisify} from "node:util";
import {runtime} from "@src/runtime/Runtime";
import {uploadListOf} from "@src/upload/UploadListOf";

const run = promisify(execFile);

const BUCKET = "flashcards-recordings";
const FOR_A_YEAR = "private, max-age=31536000, immutable";

/**
 * `pnpm --filter @language-learning/tools upload-audio` puts every recording in `private-source/recordings/` into the **local** bucket
 * that `pnpm api:dev` serves from. `-- --remote` puts them in the real one, which needs `CLOUDFLARE_API_TOKEN` and
 * `CLOUDFLARE_ACCOUNT_ID` in the environment (`.env.dev`, never printed). Putting a recording again replaces it with the same bytes.
 */
async function main(): Promise<void> {
  const remote = process.argv.includes("--remote");
  const where = whereOf(remote);
  const files = await readdir(runtime.audioFolder, {recursive: true});
  const list = uploadListOf(files);

  if (list.length === 0) {
    throw new Error(`There are no recordings in ${runtime.audioFolder}. Run generate-audio first.`);
  }

  const scratch = await mkdtemp(`${tmpdir()}/upload-audio-`);
  const listFile = `${scratch}/list.json`;

  try {
    await writeFile(listFile, JSON.stringify(list));
    await run("pnpm", [
      "--filter",
      "@language-learning/api",
      "exec",
      "wrangler",
      "r2",
      "bulk",
      "put",
      BUCKET,
      "--filename",
      listFile,
      "--content-type",
      "audio/mpeg",
      "--cache-control",
      FOR_A_YEAR,
      where,
    ]);
  } finally {
    await rm(scratch, {recursive: true, force: true});
  }

  console.warn(`Put ${list.length} recordings in the bucket (${where.slice(2)}).`);
}

function whereOf(remote: boolean): string {
  if (remote) {
    return "--remote";
  }

  return "--local";
}

await main();
