import {newCardState} from "@src/spaced-repetition/card/NewCardState";

it("builds a card nobody has studied, due from the beginning of time when it is not told when", () => {
  expect(newCardState()).toEqual({
    phase: "new",
    due: "1970-01-01T00:00:00.000Z",
    stability: 0,
    difficulty: 0,
    scheduledDays: 0,
    learningSteps: 0,
    reps: 0,
    lapses: 0,
    suspended: false,
  });
});

it("is due from the moment it is given", () => {
  expect(newCardState({due: "2026-10-05T10:00:00.000Z"}).due).toBe("2026-10-05T10:00:00.000Z");
});

it("takes any field that is given over its default, and leaves the rest as they were", () => {
  const card = newCardState({phase: "review", lapses: 3, suspended: true});

  expect(card).toMatchObject({phase: "review", lapses: 3, suspended: true, reps: 0, stability: 0});
});

it("has the optional fields only when they are given", () => {
  expect(newCardState()).not.toHaveProperty("lastReview");
  expect(newCardState({lastReview: "2026-10-05T10:00:00.000Z"}).lastReview).toBe("2026-10-05T10:00:00.000Z");
});
