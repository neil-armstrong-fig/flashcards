/** Which speaker the learner hears. Every language has one of each, chosen by ear (`docs/audio.md`). */
export const VOICES = ["male", "female"] as const;

export type Voice = (typeof VOICES)[number];
