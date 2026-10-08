import {
  dailyGoalChosen,
  deckSpeedChosen,
  deckTargetHiddenChosen,
  deckVoiceChosen,
  limitsUnlockedChosen,
  maxReviewsPerDayChosen,
  newCardsPerDayChosen,
  setAsideWhenStrugglingChosen,
  settingsReducer,
  speedChosen,
  strugglingAfterChosen,
  desiredRetentionChosen,
  reminderEnabledChosen,
  reminderHourChosen,
  themeChosen,
  voiceChosen,
} from "@src/redux/slices/settings/SettingsSlice";

it("starts with a daily goal of twenty cards, each deck on the default limits and preferences, and the male voice at normal speed", () => {
  const state = settingsReducer(undefined, {type: "unknown"});
  const limits = {newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false};
  const preferences = {voice: "male", speed: "normal", hideTarget: false};

  expect(state).toEqual({
    dailyGoalCards: 20,
    deckLimits: {
      "ko-starter": limits,
      "ko-pronunciation": limits,
      "ko-sounds-alike": limits,
      "ja-hiragana": limits,
      "ja-hiragana-combined": limits,
      "ja-katakana": limits,
      "ja-katakana-combined": limits,
      "ja-katakana-foreign": limits,
      "music-notes": limits,
    },
    deckPreferences: {
      "ko-starter": preferences,
      "ko-pronunciation": preferences,
      "ko-sounds-alike": preferences,
      "ja-hiragana": preferences,
      "ja-hiragana-combined": preferences,
      "ja-katakana": preferences,
      "ja-katakana-combined": preferences,
      "ja-katakana-foreign": preferences,
      "music-notes": preferences,
    },
    desiredRetentionPercent: 90,
    strugglingAfter: 8,
    setAsideWhenStruggling: false,
    voice: "male",
    speed: "normal",
    reminderEnabled: false,
    reminderHour: 20,
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

  expect(state.deckLimits["ko-starter"]).toMatchObject({newCardsPerDay: 0, maxReviewsPerDay: 200});
  expect(state.deckLimits["ja-hiragana"]?.newCardsPerDay).toBe(20);
});

it("caps new cards a day", () => {
  const state = settingsReducer(undefined, newCardsPerDayChosen({deckId: "ko-starter", count: 100000}));

  expect(state.deckLimits["ko-starter"]?.newCardsPerDay).toBe(999);
});

it("keeps the reviews at ten for each new card while the limits are locked", () => {
  const state = settingsReducer(undefined, newCardsPerDayChosen({deckId: "ja-hiragana", count: 3}));

  expect(state.deckLimits["ja-hiragana"]).toEqual({newCardsPerDay: 3, maxReviewsPerDay: 30, limitsUnlocked: false});
  expect(state.deckLimits["ko-starter"]?.maxReviewsPerDay).toBe(200);
});

it("ignores a choice of reviews a day while the limits are locked", () => {
  const state = settingsReducer(undefined, maxReviewsPerDayChosen({deckId: "ja-hiragana", count: 50}));

  expect(state.deckLimits["ja-hiragana"]).toEqual({newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false});
});

it("sets the reviews a deck may ask for in a day once unlocked, without touching its new cards", () => {
  const unlocked = settingsReducer(undefined, limitsUnlockedChosen({deckId: "ja-hiragana", unlocked: true}));
  const state = settingsReducer(unlocked, maxReviewsPerDayChosen({deckId: "ja-hiragana", count: 50}));

  expect(state.deckLimits["ja-hiragana"]).toEqual({newCardsPerDay: 20, maxReviewsPerDay: 50, limitsUnlocked: true});
});

it("leaves the reviews where they were when new cards change while unlocked", () => {
  const unlocked = settingsReducer(undefined, limitsUnlockedChosen({deckId: "ja-hiragana", unlocked: true}));
  const state = settingsReducer(unlocked, newCardsPerDayChosen({deckId: "ja-hiragana", count: 3}));

  expect(state.deckLimits["ja-hiragana"]).toEqual({newCardsPerDay: 3, maxReviewsPerDay: 200, limitsUnlocked: true});
});

it("puts the reviews back to ten for each new card when the limits are locked again", () => {
  const unlocked = settingsReducer(undefined, limitsUnlockedChosen({deckId: "ja-hiragana", unlocked: true}));
  const set = settingsReducer(unlocked, maxReviewsPerDayChosen({deckId: "ja-hiragana", count: 7}));
  const state = settingsReducer(set, limitsUnlockedChosen({deckId: "ja-hiragana", unlocked: false}));

  expect(state.deckLimits["ja-hiragana"]).toEqual({newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false});
});

it("replaces the voice for browsing with the one chosen", () => {
  expect(settingsReducer(undefined, voiceChosen("female")).voice).toBe("female");
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

it("sets the voice, the speed and whether the words are hidden for one deck, and leaves the other decks alone", () => {
  let state = settingsReducer(undefined, deckVoiceChosen({deckId: "ja-hiragana", voice: "female"}));

  state = settingsReducer(state, deckSpeedChosen({deckId: "ja-hiragana", speed: "slower"}));
  state = settingsReducer(state, deckTargetHiddenChosen({deckId: "ja-hiragana", hidden: true}));

  expect(state.deckPreferences["ja-hiragana"]).toEqual({voice: "female", speed: "slower", hideTarget: true});
  expect(state.deckPreferences["ko-starter"]).toEqual({voice: "male", speed: "normal", hideTarget: false});
  expect(state.voice).toBe("male");
});

it("turns the words back on for a deck", () => {
  const hidden = settingsReducer(undefined, deckTargetHiddenChosen({deckId: "ko-starter", hidden: true}));

  expect(
    settingsReducer(hidden, deckTargetHiddenChosen({deckId: "ko-starter", hidden: false})).deckPreferences["ko-starter"]
      ?.hideTarget,
  ).toBe(false);
});

it("replaces how many lapses make a card struggle, between one and ninety-nine", () => {
  expect(settingsReducer(undefined, strugglingAfterChosen(5)).strugglingAfter).toBe(5);
  expect(settingsReducer(undefined, strugglingAfterChosen(0)).strugglingAfter).toBe(1);
  expect(settingsReducer(undefined, strugglingAfterChosen(500)).strugglingAfter).toBe(99);
});

it("replaces whether struggling cards are set aside", () => {
  expect(settingsReducer(undefined, setAsideWhenStrugglingChosen(true)).setAsideWhenStruggling).toBe(true);
});

it("turns the reminder on and off", () => {
  const on = settingsReducer(undefined, reminderEnabledChosen(true));

  expect(on.reminderEnabled).toBe(true);
  expect(settingsReducer(on, reminderEnabledChosen(false)).reminderEnabled).toBe(false);
});

it("replaces the reminder hour with the one chosen", () => {
  expect(settingsReducer(undefined, reminderHourChosen(18)).reminderHour).toBe(18);
});

it.each([
  [-1, 0],
  [24, 23],
])("keeps the reminder hour on the clock: %i becomes %i", (chosen, expected) => {
  expect(settingsReducer(undefined, reminderHourChosen(chosen)).reminderHour).toBe(expected);
});
