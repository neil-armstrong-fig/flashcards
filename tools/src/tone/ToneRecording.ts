import {Mp3Encoder} from "@breezystack/lamejs";
import {frequencyOf} from "@src/tone/FrequencyOf";
import {SAMPLE_RATE, toneSamplesOf} from "@src/tone/ToneSamplesOf";

const KILOBITS_PER_SECOND = 96;
const FRAME = 1152;

/** The MP3 of the note named `C4`. Throws for a name that is not a natural note, since a deck holds nothing else. */
export function toneRecording(pitch: string): Uint8Array {
  const hertz = frequencyOf(pitch);

  if (hertz === undefined) {
    throw new Error(`"${pitch}" is not a natural note, so it has no tone`);
  }

  const samples = toneSamplesOf(hertz);
  const encoder = new Mp3Encoder(1, SAMPLE_RATE, KILOBITS_PER_SECOND);
  const parts: Uint8Array[] = [];

  for (let from = 0; from < samples.length; from += FRAME) {
    parts.push(encoder.encodeBuffer(samples.subarray(from, from + FRAME)));
  }

  parts.push(encoder.flush());

  return Uint8Array.from(parts.flatMap(part => [...part]));
}
