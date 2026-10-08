/** The clefs a sheet music note is drawn on. */
export const CLEFS = ["treble", "bass"] as const;

export type Clef = (typeof CLEFS)[number];
