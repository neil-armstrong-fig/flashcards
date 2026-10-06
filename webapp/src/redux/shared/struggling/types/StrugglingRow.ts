/** One card on the Struggling list. */
export interface StrugglingRow {
  readonly id: string;
  readonly front: string;
  readonly back: string;
  /** How many times it was forgotten once it was being reviewed. */
  readonly lapses: number;
  readonly suspended: boolean;
}
