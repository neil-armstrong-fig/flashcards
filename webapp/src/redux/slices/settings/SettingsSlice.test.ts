import {
  dailyGoalChosen,
  listenOnlyChosen,
  maxReviewsPerDayChosen,
  newCardsPerDayChosen,
  setAsideWhenStrugglingChosen,
  settingsReducer,
  speedChosen,
  strugglingAfterChosen,
  desiredRetentionChosen,
  themeChosen,
  voiceChosen,
} from "@src/redux/slices/settings/SettingsSlice";

it("starts with a daily goal of twenty cards, each deck on the default limits, and the female voice at normal speed with words shown", () => {
  const state = settingsReducer(undefined, {type: "unknown"});

  expect(state).toEqual({
    dailyGoalCards: 20,
    deckLimits: {
      "ko-starter": {newCardsPerDay: 20, maxReviewsPerDay: 200},
      "ja-hiragana": {newCardsPerDay: 20, maxReviewsPerDay: 200},
      "ja-katakana": {newCardsPerDay: 20, maxReviewsPerDay: 200},
    },
    desiredRetentionPercent: 90,
    strugglingAfter: 8,
    setAsideWhenStruggling: false,
    voice: "female",
    speed: "normal",
    listenOnly: false,
    theme: "system",
  });
});

it("replaces the daily goal with the one chosen", () => {
  expect(settingsReducer(undefined, dailyGoalChosen(45)).dailyGoalCards).toBe(45);
});

it("keeps the daily goal at least one card", () => {
  expect(settingsReducer(undefined, dailyGoalChosen(0)).dailyGoalCards).toBe(1);
});

it("allows no new cards at all in a deck, and leaves the other decks alone", () => {
  const state = settingsReducer(undefined, newCardsPerDayChosen({deckId: "ko-starter", count: 0}));

  expect(state.deckLimits["ko-starter"]).toEqual({newCardsPerDay: 0, maxReviewsPerDay: 200});
  expect(state.deckLimits["ja-hiragana"]?.newCardsPerDay).toBe(20);
});

it("caps new cards a day", () => {
  const state = settingsReducer(undefined, newCardsPerDayChosen({deckId: "ko-starter", count: 100000}));

  expect(state.deckLimits["ko-starter"]?.newCardsPerDay).toBe(999);
});

it("sets the reviews a deck may ask for in a day, without touching its new cards", () => {
  const state = settingsReducer(undefined, maxReviewsPerDayChosen({deckId: "ja-hiragana", count: 50}));

  expect(state.deckLimits["ja-hiragana"]).toEqual({newCardsPerDay: 20, maxReviewsPerDay: 50});
});

it("replaces the voice with the one chosen", () => {
  expect(settingsReducer(undefined, voiceChosen("male")).voice).toBe("male");
});

it("replaces the desired retention, held between 70 and 97 percent", () => {
  expect(settingsReducer(undefined, desiredRetentionChosen(80)).desiredRetentionPercent).toBe(80);
  expect(settingsReducer(undefined, desiredRetentionChosen(100)).desiredRetentionPercent).toBe(97);
  expect(settingsReducer(undefined, desiredRetentionChosen(10)).desiredRetentionPercent).toBe(70);
});

it("replaces the colours with the ones chosen", () => {
  expect(settingsReducer(undefined, themeChosen("dark")).theme).toBe("dark");
});

it("replaces the speed with the one chosen", () => {
  expect(settingsReducer(undefined, speedChosen("slower")).speed).toBe("slower");
});

it("turns listening without reading on and off", () => {
  const on = settingsReducer(undefined, listenOnlyChosen(true));

  expect(on.listenOnly).toBe(true);
  expect(settingsReducer(on, listenOnlyChosen(false)).listenOnly).toBe(false);
});

it("replaces how many lapses make a card struggle, between one and ninety-nine", () => {
  expect(settingsReducer(undefined, strugglingAfterChosen(5)).strugglingAfter).toBe(5);
  expect(settingsReducer(undefined, strugglingAfterChosen(0)).strugglingAfter).toBe(1);
  expect(settingsReducer(undefined, strugglingAfterChosen(500)).strugglingAfter).toBe(99);
});

it("replaces whether struggling cards are set aside", () => {
  expect(settingsReducer(undefined, setAsideWhenStrugglingChosen(true)).setAsideWhenStruggling).toBe(true);
});
