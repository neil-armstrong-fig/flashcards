import {createSlice} from "@reduxjs/toolkit";
import type {TakenSettings} from "@src/redux/slices/settings/sync/types/TakenSettings";
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
import {DEFAULT_DECK_PREFERENCES} from "@src/redux/slices/settings/limits/DefaultDeckPreferences";
import {reviewsLinkedToNewCards} from "@src/redux/slices/settings/limits/ReviewsLinkedToNewCards";
import {DEFAULT_DECK_LIMITS} from "@src/redux/slices/settings/limits/DefaultDeckLimits";
import {INITIAL_SETTINGS_STATE} from "@src/redux/slices/settings/initial-state/InitialSettingsState";

/** A new value for one of a deck's daily limits. */
interface DeckLimitChange {
  readonly deckId: string;
  readonly count: number;
}

/** A new voice for one deck. */
interface DeckVoiceChange {
  readonly deckId: string;
  readonly voice: Voice;
}

/** A new speed for one deck. */
interface DeckSpeedChange {
  readonly deckId: string;
  readonly speed: Speed;
}

/** Whether one deck keeps the target-language word off the front of its cards. */
interface DeckTargetHiddenChange {
  readonly deckId: string;
  readonly hidden: boolean;
}

/** Whether one deck's reviews a day may be set apart from its new cards. */
interface DeckLimitsUnlockedChange {
  readonly deckId: string;
  readonly unlocked: boolean;
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

      const newCardsPerDay = clampToLimits(count, NEW_CARDS_PER_DAY_LIMITS);

      if (limits.limitsUnlocked) {
        state.deckLimits[deckId] = {...limits, newCardsPerDay};

        return;
      }

      state.deckLimits[deckId] = {
        ...limits,
        newCardsPerDay,
        maxReviewsPerDay: reviewsLinkedToNewCards(newCardsPerDay, limits.maxReviewsPerDay),
      };
    },

    maxReviewsPerDayChosen: (state, action: PayloadAction<DeckLimitChange>) => {
      const {deckId, count} = action.payload;
      const limits = state.deckLimits[deckId] ?? DEFAULT_DECK_LIMITS;

      if (!limits.limitsUnlocked) {
        return;
      }

      state.deckLimits[deckId] = {...limits, maxReviewsPerDay: clampToLimits(count, MAX_REVIEWS_PER_DAY_LIMITS)};
    },

    limitsUnlockedChosen: (state, action: PayloadAction<DeckLimitsUnlockedChange>) => {
      const {deckId, unlocked} = action.payload;
      const limits = state.deckLimits[deckId] ?? DEFAULT_DECK_LIMITS;

      if (unlocked) {
        state.deckLimits[deckId] = {...limits, limitsUnlocked: true};

        return;
      }

      state.deckLimits[deckId] = {
        ...limits,
        limitsUnlocked: false,
        maxReviewsPerDay: reviewsLinkedToNewCards(limits.newCardsPerDay, limits.maxReviewsPerDay),
      };
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

    settingsTaken: (state, action: PayloadAction<TakenSettings["chosen"]>) => {
      Object.assign(state, action.payload);
    },

    themeChosen: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },

    deckVoiceChosen: (state, action: PayloadAction<DeckVoiceChange>) => {
      const {deckId, voice} = action.payload;

      state.deckPreferences[deckId] = {...(state.deckPreferences[deckId] ?? DEFAULT_DECK_PREFERENCES), voice};
    },

    deckSpeedChosen: (state, action: PayloadAction<DeckSpeedChange>) => {
      const {deckId, speed} = action.payload;

      state.deckPreferences[deckId] = {...(state.deckPreferences[deckId] ?? DEFAULT_DECK_PREFERENCES), speed};
    },

    deckTargetHiddenChosen: (state, action: PayloadAction<DeckTargetHiddenChange>) => {
      const {deckId, hidden} = action.payload;

      state.deckPreferences[deckId] = {
        ...(state.deckPreferences[deckId] ?? DEFAULT_DECK_PREFERENCES),
        hideTarget: hidden,
      };
    },
  },
});

export const {
  dailyGoalChosen,
  newCardsPerDayChosen,
  maxReviewsPerDayChosen,
  limitsUnlockedChosen,
  desiredRetentionChosen,
  strugglingAfterChosen,
  setAsideWhenStrugglingChosen,
  voiceChosen,
  speedChosen,
  deckVoiceChosen,
  deckSpeedChosen,
  deckTargetHiddenChosen,
  themeChosen,
  settingsTaken,
} = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
