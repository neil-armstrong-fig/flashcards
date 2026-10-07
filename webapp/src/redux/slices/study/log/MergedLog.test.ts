import {mergedLog} from "@src/redux/slices/study/log/MergedLog";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";

function entry(cardId: string, reviewedAt: string, phaseBefore: ReviewLogEntry["phaseBefore"] = "new"): ReviewLogEntry {
  return {cardId, rating: "good", phaseBefore, reviewedAt, scheduledDays: 0, due: reviewedAt};
}

const FIRST = "2026-10-05T10:00:00.000Z";
const SECOND = "2026-10-05T10:05:00.000Z";

it("adds an answer that is not in the log, after the ones that are", () => {
  const mine = entry("c1", FIRST);
  const theirs = entry("c1", SECOND, "learning");

  expect(mergedLog([mine], [mine, theirs])).toEqual([mine, theirs]);
});

it("replaces an answer already in the log by what has been worked out for it, so its phase is the one it now has", () => {
  const was = entry("c1", SECOND, "new");
  const now = entry("c1", SECOND, "review");

  expect(mergedLog([was], [now])).toEqual([now]);
});

it("leaves the answers it was not told about alone, and keeps their order", () => {
  const other = entry("c2", FIRST);

  expect(mergedLog([other, entry("c1", SECOND)], [entry("c1", SECOND, "review")])).toEqual([
    other,
    entry("c1", SECOND, "review"),
  ]);
});
