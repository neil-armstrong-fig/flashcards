/** The short lines through or beside a note too far above or below the staff to rest on its own lines: every line position from the staff out to the note (for a note in a space, out to the line beside it nearest the staff). */
export function ledgerStepsOf(steps: number): number[] {
  const ledgers: number[] = [];

  for (let step = -2; step >= steps; step -= 2) {
    ledgers.push(step);
  }

  for (let step = 10; step <= steps; step += 2) {
    ledgers.push(step);
  }

  return ledgers;
}
