/** One device to remind, as the database keeps it. */
export interface StoredReminder {
  readonly userId: string;
  /** The push service's address for the device. */
  readonly endpoint: string;
  readonly hour: number;
  readonly timeZone: string;
  readonly goalMetOn?: string;
  readonly lastSentOn?: string;
}
