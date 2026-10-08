/** What a device says when it asks to be reminded. */
export interface NewReminder {
  readonly endpoint: string;
  readonly hour: number;
  readonly timeZone: string;
}
