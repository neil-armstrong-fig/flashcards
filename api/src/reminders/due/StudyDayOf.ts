/** The study day rolls over at four in the morning, learner's time, not at midnight (`docs/scheduling.md`). */
const ROLLOVER_HOUR = 4;

const HOUR_IN_MS = 60 * 60 * 1000;

/** The study day a moment falls in, in a learner's time zone, as `YYYY-MM-DD`. Half past two in the morning still belongs to the day before. */
export function studyDayOf(now: Date, timeZone: string): string {
  const shifted = new Date(now.getTime() - ROLLOVER_HOUR * HOUR_IN_MS);

  // `Intl` has no option for an ISO date, but the Swedish locale happens to write one as `YYYY-MM-DD`, so it is used for that and
  // nothing to do with Swedish. The app builds the same string by hand (`studyDayKey` in the webapp) and the two must agree. This
  // package may not import the webapp, so `StudyDayOf.test.ts` pins the expected strings instead: if the runtime's Swedish format
  // ever changed, those tests would fail.
  return new Intl.DateTimeFormat("sv-SE", {timeZone, year: "numeric", month: "2-digit", day: "2-digit"}).format(
    shifted,
  );
}
