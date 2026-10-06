import {MAX_ATTEMPTS, nextStepAfter} from "@src/azure/answer/NextStepAfter";
import {requestOf} from "@src/azure/request/RequestOf";
import {runtime} from "@src/runtime/Runtime";
import {sleep} from "@src/runtime/Sleep";
import {waitForTurn} from "@src/throttle/WaitForTurn";
import type {RecordingJob} from "@src/plan/types/RecordingJob";

/**
 * The MP3 bytes of one recording, from Azure AI Speech over its REST API, with the account in the runtime. A refusal that
 * stops the run says the status and never the key.
 */
export async function synthesiseRecording(job: RecordingJob): Promise<Uint8Array> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    await waitForTurn();

    const response = await fetch(requestOf(job, runtime));
    const step = nextStepAfter({
      status: response.status,
      retryAfter: response.headers.get("Retry-After") ?? undefined,
      attempt,
    });

    if (step.kind === "use") {
      return new Uint8Array(await response.arrayBuffer());
    }

    if (step.kind === "stop") {
      throw new Error(`Azure refused "${job.text}" (${job.variant}) with status ${response.status}`);
    }

    await sleep(step.ms);
  }

  throw new Error(`Azure kept refusing "${job.text}" (${job.variant})`);
}
