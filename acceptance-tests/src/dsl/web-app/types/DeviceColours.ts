/** What a device can ask an app to wear: the two schemes an operating system offers. */
export const DEVICE_COLOURS = ["light", "dark"] as const;

export type DeviceColours = (typeof DEVICE_COLOURS)[number];
