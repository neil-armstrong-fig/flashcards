/** The note on a sheet music card, as drawn: which clef, and how far the note sits above the staff's bottom line in lines and spaces. */
export interface ShownNotation {
  readonly clef: string;
  readonly stepsAboveBottomLine: number;
}
