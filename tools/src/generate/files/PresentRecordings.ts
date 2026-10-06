import {access} from "node:fs/promises";
import {runtime} from "@src/runtime/Runtime";
import type {RecordingJob} from "@src/plan/types/RecordingJob";

/** The files of these jobs that are already kept. */
export async function presentRecordings(jobs: readonly RecordingJob[]): Promise<ReadonlySet<string>> {
  const present = new Set<string>();

  for (const job of jobs) {
    if (await exists(`${runtime.audioFolder}${job.file}`)) {
      present.add(job.file);
    }
  }

  return present;
}

async function exists(path: string): Promise<boolean> {
  return await access(path).then(
    () => true,
    () => false,
  );
}
