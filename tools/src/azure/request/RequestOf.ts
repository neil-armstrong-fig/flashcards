import {ssmlOf} from "@flashcards/shared/audio/azure/SsmlOf";
import type {RecordingJob} from "@src/plan/types/RecordingJob";

const OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";

interface AzureAccount {
  readonly region: string;
  readonly key: string;
}

/** The request that asks Azure AI Speech for one recording. */
export function requestOf(job: RecordingJob, {region, key}: AzureAccount): Request {
  return new Request(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": OUTPUT_FORMAT,
      "User-Agent": "flashcards-audio-tool",
    },
    body: ssmlOf(job),
  });
}
