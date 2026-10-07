import {isLaterChoice} from "@flashcards/shared/sync/IsLaterChoice";

it("beats a setting never chosen", () => {
  expect(isLaterChoice("2026-10-05T10:00:00.000Z", undefined)).toBe(true);
});

it("beats an earlier choice and loses to a later one, whatever the spelling of the time", () => {
  expect(isLaterChoice("2026-10-05T10:00:01.000Z", "2026-10-05T10:00:00.000Z")).toBe(true);
  expect(isLaterChoice("2026-10-05T10:00:00.000Z", "2026-10-05T10:00:01.000Z")).toBe(false);
  expect(isLaterChoice("2026-10-05T10:00:00+00:00", "2026-10-05T11:00:00.000+01:00")).toBe(false);
});

it("loses a tie, so a choice that has been applied is not applied again", () => {
  expect(isLaterChoice("2026-10-05T10:00:00.000Z", "2026-10-05T10:00:00.000Z")).toBe(false);
});
