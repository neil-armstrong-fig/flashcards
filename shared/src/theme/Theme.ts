/** How the app is coloured: one of the two palettes, or whichever the device asks for. */
export const THEMES = ["system", "light", "dark"] as const;

export type Theme = (typeof THEMES)[number];
