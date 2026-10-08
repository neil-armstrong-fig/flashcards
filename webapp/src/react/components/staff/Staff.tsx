import {staffStepsOf} from "@src/react/components/staff/utils/StaffStepsOf";
import {BassClef} from "@src/react/components/staff/components/bass-clef/BassClef";
import {TrebleClef} from "@src/react/components/staff/components/treble-clef/TrebleClef";
import {ledgerStepsOf} from "@src/react/components/staff/utils/LedgerStepsOf";
import type {Notation} from "@flashcards/content/types/Notation";

const WIDTH = 220;
const HEIGHT = 170;
const LEFT = 10;
const RIGHT = 210;
const BOTTOM_LINE_Y = 120;
const STEP = 8;
const NOTE_X = 140;
const CLEF_NAMES = {treble: "Treble clef", bass: "Bass clef"} as const;
/** The steps above the bottom line of the G line the treble clef is set on, and of the F line the bass clef is. */
const G_LINE_STEP = 2;
const F_LINE_STEP = 6;
const CLEF_X = 14;
const LINE_STEPS = [0, 2, 4, 6, 8] as const;

interface Props {
  notation: Notation;
  testId: string;
  /** The size the staff is drawn at: it fills the width it is given. */
  className: string;
}

/** A single whole note on a five-line staff, drawn from its clef and pitch. The name is not written: that is the answer. */
export function Staff({notation, testId, className}: Props): React.JSX.Element | undefined {
  const steps = staffStepsOf(notation.clef, notation.pitch);

  if (steps === undefined) {
    return undefined;
  }

  const yOf = (step: number): number => BOTTOM_LINE_Y - step * STEP;

  return (
    <svg
      data-testid={testId}
      data-clef={notation.clef}
      data-steps-above-bottom-line={steps}
      role="img"
      aria-label={`${CLEF_NAMES[notation.clef]} staff with one note`}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={`text-ink ${className}`}
    >
      {LINE_STEPS.map(step => (
        <line key={step} x1={LEFT} x2={RIGHT} y1={yOf(step)} y2={yOf(step)} stroke="currentColor" strokeWidth={1.5} />
      ))}

      {ledgerStepsOf(steps).map(step => (
        <line
          key={`ledger-${step}`}
          x1={NOTE_X - 16}
          x2={NOTE_X + 16}
          y1={yOf(step)}
          y2={yOf(step)}
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ))}

      {notation.clef === "treble" && <TrebleClef x={CLEF_X} y={yOf(G_LINE_STEP)} staffSpace={STEP * 2} />}

      {notation.clef === "bass" && <BassClef x={CLEF_X} y={yOf(F_LINE_STEP)} staffSpace={STEP * 2} />}

      <ellipse
        cx={NOTE_X}
        cy={yOf(steps)}
        rx={11}
        ry={STEP * 0.85}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        transform={`rotate(-15 ${NOTE_X} ${yOf(steps)})`}
      />
    </svg>
  );
}
