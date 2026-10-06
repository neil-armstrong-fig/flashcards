import type {AudioManifest} from "@language-learning/content/audio/types/AudioManifest";
import type {RecordingFiles} from "@language-learning/content/audio/types/AudioManifest";
import type {RecordingJob} from "@src/plan/types/RecordingJob";

/** The manifest naming every job whose file exists, grouped by language and then by text, in the order the jobs came. */
export function manifestOf(jobs: readonly RecordingJob[], exists: (file: string) => boolean): AudioManifest {
  const manifest: Record<string, Record<string, RecordingFiles>> = {};

  for (const job of jobs) {
    if (!exists(job.file)) {
      continue;
    }

    const texts = (manifest[job.language] ??= {});

    texts[job.text] = {...texts[job.text], [job.variant]: job.file};
  }

  return manifest;
}
