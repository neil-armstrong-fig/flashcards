/** The stretch of an object to read: from a point for some bytes, to the end, or the last few. */
export interface R2Range {
  readonly offset?: number;
  readonly length?: number;
  readonly suffix?: number;
}
