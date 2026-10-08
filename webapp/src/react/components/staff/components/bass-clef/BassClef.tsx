/** The bass clef, set on the F line (the second from the top) of a staff. Outlines from the Bravura music font by Steinberg (SIL Open Font License 1.1, `REFERENCES.md`), glyph U+E062. */
const PATH =
  "M252-262C78-262 0-135 0-39C0 41 42 110 123 110C186 110 229 66 229 4C229-60 182-100 133-100C106-100 96-93 83-93C70-93 67-101 67-111C67-151 127-224 229-224C335-224 381-120 381 37C381 140 359 260 297 356C237 449 134 534 10 605C1 610-5 615-5 623C-5 629-1 635 8 635C13 635 19 633 25 630C158 565 286 489 392 375C479 281 531 159 531 28C531-146 425-262 252-262M629-180C598-180 574-156 574-125C574-94 598-70 629-70C660-70 684-94 684-125C684-156 660-180 629-180M630 71C599 71 576 94 576 125C576 156 599 179 630 179C661 179 684 156 684 125C684 94 661 71 630 71";

/** A staff space is 250 font units in the outlines above. */
const UNITS_PER_STAFF_SPACE = 250;

interface Props {
  /** Where the clef starts, and the height of the F line (the second from the top) it is set on. */
  x: number;
  y: number;
  /** How tall a staff space is, which sizes the clef to the staff. */
  staffSpace: number;
}

export function BassClef({x, y, staffSpace}: Props): React.JSX.Element {
  return (
    <path
      d={PATH}
      fill="currentColor"
      transform={`translate(${x} ${y}) scale(${staffSpace / UNITS_PER_STAFF_SPACE})`}
    />
  );
}
