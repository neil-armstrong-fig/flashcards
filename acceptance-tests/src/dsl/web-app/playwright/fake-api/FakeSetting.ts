/** A setting the fake API keeps: its value, and when it was chosen. */
export interface FakeSetting {
  readonly value: unknown;
  readonly at: string;
}
