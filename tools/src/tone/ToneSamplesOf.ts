export const SAMPLE_RATE = 44100;

const SECONDS = 1.5;
const FADE_IN_SECONDS = 0.01;
const DECAY_PER_SECOND = 3;
/** How loud each overtone is beside the note itself, which gives a plucked, piano-like colour rather than a bare sine. */
const OVERTONE_LEVELS = [1, 0.5, 0.25, 0.12] as const;
const PEAK = 0.8 * 32767;

/** One note as 16-bit mono samples: the note and a few overtones, struck quickly and left to die away. Nothing random, so the same pitch is the same bytes. */
export function toneSamplesOf(hertz: number): Int16Array {
  const samples = new Int16Array(Math.round(SAMPLE_RATE * SECONDS));
  const total = OVERTONE_LEVELS.reduce((sum, level) => sum + level, 0);

  for (let index = 0; index < samples.length; index += 1) {
    const seconds = index / SAMPLE_RATE;
    const envelope = Math.min(1, seconds / FADE_IN_SECONDS) * Math.exp(-DECAY_PER_SECOND * seconds);
    const wave = OVERTONE_LEVELS.reduce((sum, level, overtone) => {
      return sum + level * Math.sin(2 * Math.PI * hertz * (overtone + 1) * seconds);
    }, 0);

    samples[index] = Math.round((PEAK * envelope * wave) / total);
  }

  return samples;
}
