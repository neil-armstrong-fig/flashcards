/** What the API needs to remind one device: where to push, the hour (0 to 23) in the learner's own time, and which time that is. */
export interface ReminderRequest {
  readonly endpoint: string;
  readonly hour: number;
  readonly timeZone: string;
}
