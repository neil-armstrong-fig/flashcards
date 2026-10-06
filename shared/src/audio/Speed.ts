/** How fast a recording is spoken. Slower is `-15%`, and nothing slower, because it sounds distorted (`docs/audio.md`). */
export const SPEEDS = ["normal", "slower"] as const;

export type Speed = (typeof SPEEDS)[number];
