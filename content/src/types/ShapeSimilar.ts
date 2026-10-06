/** A character easily mistaken for another by its shape, and the sound it really has: the two are shown together so they can be told apart. */
export interface ShapeSimilar {
  readonly character: string;
  /** Its sound in Latin letters, as a kana note's `meaning` gives it. */
  readonly sound: string;
}
