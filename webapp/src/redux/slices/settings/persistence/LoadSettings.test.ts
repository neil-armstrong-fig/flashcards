import {INITIAL_SETTINGS_STATE} from "@src/redux/slices/settings/initial-state/InitialSettingsState";
import {loadSettings} from "@src/redux/slices/settings/persistence/LoadSettings";
import {keepStoredSettings} from "@src/storage/local-storage/settings/KeepStoredSettings";

function holding(stored: unknown): void {
  keepStoredSettings(stored);
}

it("loads the settings that were kept", () => {
  const kept = {
    dailyGoalCards: 45,
    deckLimits: {
      "ko-starter": {newCardsPerDay: 5, maxReviewsPerDay: 50, limitsUnlocked: false},
      "ko-pronunciation": {newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false},
      "ko-sounds-alike": {newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false},
      "ja-hiragana": {newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false},
      "ja-hiragana-combined": {newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false},
      "ja-katakana": {newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false},
      "ja-katakana-combined": {newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false},
      "ja-katakana-foreign": {newCardsPerDay: 20, maxReviewsPerDay: 200, limitsUnlocked: false},
    },
    deckPreferences: {
      "ko-starter": {voice: "female", speed: "slower", hideTarget: true},
      "ko-pronunciation": {voice: "male", speed: "normal", hideTarget: false},
      "ko-sounds-alike": {voice: "male", speed: "normal", hideTarget: false},
      "ja-hiragana": {voice: "male", speed: "normal", hideTarget: false},
      "ja-hiragana-combined": {voice: "male", speed: "normal", hideTarget: false},
      "ja-katakana": {voice: "male", speed: "normal", hideTarget: false},
      "ja-katakana-combined": {voice: "male", speed: "normal", hideTarget: false},
      "ja-katakana-foreign": {voice: "male", speed: "normal", hideTarget: false},
    },
    desiredRetentionPercent: 80,
    strugglingAfter: 3,
    setAsideWhenStruggling: true,
    voice: "male",
    speed: "slower",
    reminderEnabled: true,
    reminderHour: 7,
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
    voice: "male",
    speed: "normal",
    reminderEnabled: false,
    reminderHour: 20,
    theme: "system",
  });
});

it.each([
  ["a voice that does not exist", {voice: "robot"}, {voice: "male"}],
  ["a speed that does not exist", {speed: "glacial"}, {speed: "normal"}],
  ["a struggling threshold out of range", {strugglingAfter: 0}, {strugglingAfter: 8}],
  ["a set-aside flag that is not a boolean", {setAsideWhenStruggling: 1}, {setAsideWhenStruggling: false}],
  ["a retention out of range", {desiredRetentionPercent: 50}, {desiredRetentionPercent: 90}],
  ["a reminder flag that is not a boolean", {reminderEnabled: "yes"}, {reminderEnabled: false}],
  ["a reminder hour off the clock", {reminderHour: 24}, {reminderHour: 20}],
  ["colours that do not exist", {theme: "sepia"}, {theme: "system"}],
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
    voice: "male",
    speed: "normal",
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
    limitsUnlocked: false,
  });
  holding(kept);
  expect(loadSettings().deckLimits["ko-starter"]).toEqual({
    newCardsPerDay: 20,
    maxReviewsPerDay: 200,
    limitsUnlocked: false,
  });
});

it("gives every deck the voice, speed and listen-only choice kept before there was one for each", () => {
  holding({voice: "female", speed: "slower", listenOnly: true});

  expect(loadSettings().deckPreferences["ko-starter"]).toEqual({voice: "female", speed: "slower", hideTarget: true});
  expect(loadSettings().deckPreferences["ja-katakana"]).toEqual({voice: "female", speed: "slower", hideTarget: true});
});
