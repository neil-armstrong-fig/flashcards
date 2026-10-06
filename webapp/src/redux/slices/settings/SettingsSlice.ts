import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import {clampToLimits} from "@src/redux/slices/settings/limits/ClampToLimits";
import {
  DAILY_GOAL_CARDS_LIMITS,
  DESIRED_RETENTION_PERCENT_LIMITS,
  MAX_REVIEWS_PER_DAY_LIMITS,
  NEW_CARDS_PER_DAY_LIMITS,
  STRUGGLING_AFTER_LIMITS,
} from "@src/redux/slices/settings/limits/SettingLimits";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Theme} from "@flashcards/shared/theme/Theme";
import type {Voice} from "@flashcards/shared/audio/Voice";
import {DEFAULT_DECK_LIMITS} from "@src/redux/slices/settings/limits/DefaultDeckLimits";
import {INITIAL_SETTINGS_STATE} from "@src/redux/slices/settings/initial-state/InitialSettingsState";

/** A new value for one of a deck's daily limits. */
interface DeckLimitChange {
  readonly deckId: string;
  readonly count: number;
}

const settingsSlice = createSlice({
  name: "settings",
  initialState: INITIAL_SETTINGS_STATE,
  reducers: {
    dailyGoalChosen: (state, action: PayloadAction<number>) => {
      state.dailyGoalCards = clampToLimits(action.payload, DAILY_GOAL_CARDS_LIMITS);
    },

    newCardsPerDayChosen: (state, action: PayloadAction<DeckLimitChange>) => {
      const {deckId, count} = action.payload;
      const limits = state.deckLimits[deckId] ?? DEFAULT_DECK_LIMITS;

      state.deckLimits[deckId] = {...limits, newCardsPerDay: clampToLimits(count, NEW_CARDS_PER_DAY_LIMITS)};
    },

    maxReviewsPerDayChosen: (state, action: PayloadAction<DeckLimitChange>) => {
      const {deckId, count} = action.payload;
      const limits = state.deckLimits[deckId] ?? DEFAULT_DECK_LIMITS;

      state.deckLimits[deckId] = {...limits, maxReviewsPerDay: clampToLimits(count, MAX_REVIEWS_PER_DAY_LIMITS)};
    },

    desiredRetentionChosen: (state, action: PayloadAction<number>) => {
      state.desiredRetentionPercent = clampToLimits(action.payload, DESIRED_RETENTION_PERCENT_LIMITS);
    },

    strugglingAfterChosen: (state, action: PayloadAction<number>) => {
      state.strugglingAfter = clampToLimits(action.payload, STRUGGLING_AFTER_LIMITS);
    },

    setAsideWhenStrugglingChosen: (state, action: PayloadAction<boolean>) => {
      state.setAsideWhenStruggling = action.payload;
    },

    voiceChosen: (state, action: PayloadAction<Voice>) => {
      state.voice = action.payload;
    },

    speedChosen: (state, action: PayloadAction<Speed>) => {
      state.speed = action.payload;
    },

    themeChosen: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },

    listenOnlyChosen: (state, action: PayloadAction<boolean>) => {
      state.listenOnly = action.payload;
    },
  },
});

export const {
  dailyGoalChosen,
  newCardsPerDayChosen,
  maxReviewsPerDayChosen,
  desiredRetentionChosen,
  strugglingAfterChosen,
  setAsideWhenStrugglingChosen,
  voiceChosen,
  speedChosen,
  listenOnlyChosen,
  themeChosen,
} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
