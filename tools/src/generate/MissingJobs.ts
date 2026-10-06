import type {RecordingJob} from "@src/plan/types/RecordingJob";

/** The jobs whose recording is not kept yet, in the order they came. */
export function missingJobs(jobs: readonly RecordingJob[], present: ReadonlySet<string>): RecordingJob[] {
  return jobs.filter(job => !present.has(job.file));
}
