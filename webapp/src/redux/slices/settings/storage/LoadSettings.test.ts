import {INITIAL_SETTINGS_STATE} from "@src/redux/slices/settings/initial-state/InitialSettingsState";
import {loadSettings} from "@src/redux/slices/settings/storage/LoadSettings";
import {SETTINGS_STORAGE_KEY} from "@src/redux/slices/settings/storage/SettingsStorageKey";

function holding(stored: unknown): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(stored));
}

it("loads the settings that were kept", () => {
  const kept = {
    dailyGoalCards: 45,
    deckLimits: {
      "ko-starter": {newCardsPerDay: 5, maxReviewsPerDay: 50},
      "ja-hiragana": {newCardsPerDay: 20, maxReviewsPerDay: 200},
      "ja-katakana": {newCardsPerDay: 20, maxReviewsPerDay: 200},
    },
    desiredRetentionPercent: 80,
    strugglingAfter: 3,
    setAsideWhenStruggling: true,
    voice: "male",
    speed: "slower",
    listenOnly: true,
    theme: "light",
  };

  holding(kept);
  expect(loadSettings()).toEqual(kept);
});

it("gives the audio settings their defaults when what was kept predates them", () => {
  holding({dailyGoalCards: 45});
  expect(loadSettings()).toMatchObject({
    dailyGoalCards: 45,
    desiredRetentionPercent: 90,
    strugglingAfter: 8,
    setAsideWhenStruggling: false,
    voice: "female",
    speed: "normal",
    listenOnly: false,
    theme: "system",
  });
});

it.each([
  ["a voice that does not exist", {voice: "robot"}, {voice: "female"}],
  ["a speed that does not exist", {speed: "glacial"}, {speed: "normal"}],
  ["a struggling threshold out of range", {strugglingAfter: 0}, {strugglingAfter: 8}],
  ["a set-aside flag that is not a boolean", {setAsideWhenStruggling: 1}, {setAsideWhenStruggling: false}],
  ["a retention out of range", {desiredRetentionPercent: 50}, {desiredRetentionPercent: 90}],
  ["colours that do not exist", {theme: "sepia"}, {theme: "system"}],
  ["a listen-only flag that is not a boolean", {listenOnly: "yes"}, {listenOnly: false}],
])("does not trust %s", (_name, stored, expected) => {
  holding(stored);
  expect(loadSettings()).toMatchObject(expected);
});

it("starts from the defaults when nothing was kept", () => {
  expect(loadSettings()).toEqual(INITIAL_SETTINGS_STATE);
  expect(loadSettings()).toMatchObject({
    dailyGoalCards: 20,
    strugglingAfter: 8,
    setAsideWhenStruggling: false,
    voice: "female",
    speed: "normal",
    listenOnly: false,
  });
});

it("falls back to a default for one bad field and keeps the good one", () => {
  holding({dailyGoalCards: "lots", strugglingAfter: 5});
  expect(loadSettings()).toMatchObject({
    dailyGoalCards: 20,
    strugglingAfter: 5,
  });
});

it("does not read a goal kept in minutes, as an earlier version did, as a number of cards", () => {
  holding({dailyGoalMinutes: 45});
  expect(loadSettings()).toMatchObject({dailyGoalCards: 20});
});

it("loads the limits of a deck apart from the other decks'", () => {
  const kept = {deckLimits: {"ja-hiragana": {newCardsPerDay: 3, maxReviewsPerDay: 30}}};

  holding(kept);
  expect(loadSettings().deckLimits["ja-hiragana"]).toEqual({
    newCardsPerDay: 3,
    maxReviewsPerDay: 30,
  });
  holding(kept);
  expect(loadSettings().deckLimits["ko-starter"]).toEqual({
    newCardsPerDay: 20,
    maxReviewsPerDay: 200,
  });
});
