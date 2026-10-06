import {manifestOf} from "@src/manifest/ManifestOf";
import {missingJobs} from "@src/generate/MissingJobs";
import {presentRecordings} from "@src/generate/files/PresentRecordings";
import {recordingsNeeded} from "@src/plan/RecordingsNeeded";
import {saveRecording} from "@src/generate/files/SaveRecording";
import {synthesiseRecording} from "@src/azure/SynthesiseRecording";
import {writeManifest} from "@src/generate/files/WriteManifest";
import type {Deck} from "@language-learning/content/types/Deck";

interface GenerationSummary {
  /** Recordings the decks need. */
  readonly needed: number;
  /** Recordings made this run. */
  readonly made: number;
  /** Characters sent to Azure this run, which the free tier counts (0.5 million a month). */
  readonly characters: number;
}

/**
 * Makes each recording the decks need that is not already kept, one at a time, then writes the manifest naming everything
 * that exists. The manifest is written even when a recording fails, so a run stopped halfway keeps what it made, and the next
 * run carries on from there.
 */
export async function generateAudio(decks: readonly Deck[]): Promise<GenerationSummary> {
  const jobs = recordingsNeeded(decks);
  const missing = missingJobs(jobs, await presentRecordings(jobs));
  let made = 0;
  let characters = 0;

  console.warn(`${jobs.length} recordings needed, ${missing.length} to make.`);

  try {
    for (const job of missing) {
      await saveRecording(job.file, await synthesiseRecording(job));
      made += 1;
      characters += job.text.length;
      console.warn(`${made}/${missing.length} ${job.variant} ${job.text}`);
    }
  } finally {
    const present = await presentRecordings(jobs);

    await writeManifest(manifestOf(jobs, file => present.has(file)));
  }

  return {needed: jobs.length, made, characters};
}
