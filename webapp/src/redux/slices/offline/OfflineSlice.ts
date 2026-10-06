import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {OfflineState} from "@src/redux/slices/offline/types/OfflineState";

const INITIAL_OFFLINE_STATE: OfflineState = {decks: {}};

interface Counted {
  readonly deckId: string;
  readonly kept: number;
  readonly total: number;
}

interface Progress {
  readonly deckId: string;
  readonly kept: number;
}

interface Finished {
  readonly deckId: string;
  readonly kept: number;
  readonly total: number;
}

const offlineSlice = createSlice({
  name: "offline",
  initialState: INITIAL_OFFLINE_STATE,
  reducers: {
    counted: (state, action: PayloadAction<readonly Counted[]>) => {
      for (const {deckId, kept, total} of action.payload) {
        const before = state.decks[deckId];

        state.decks[deckId] = {kept, total, working: before?.working ?? false, incomplete: before?.incomplete ?? false};
      }
    },

    keepingStarted: (state, action: PayloadAction<string>) => {
      const before = state.decks[action.payload];

      state.decks[action.payload] = {kept: 0, total: before?.total ?? 0, working: true, incomplete: false};
    },

    keepingProgressed: (state, action: PayloadAction<Progress>) => {
      const before = state.decks[action.payload.deckId];

      if (before) {
        before.kept = action.payload.kept;
      }
    },

    keepingFinished: (state, action: PayloadAction<Finished>) => {
      const {deckId, kept, total} = action.payload;

      state.decks[deckId] = {kept, total, working: false, incomplete: kept < total};
    },

    forgotten: state => {
      for (const deck of Object.values(state.decks)) {
        deck.kept = 0;
        deck.working = false;
        deck.incomplete = false;
      }
    },
  },
});

export const {counted, keepingStarted, keepingProgressed, keepingFinished, forgotten} = offlineSlice.actions;
export const offlineReducer = offlineSlice.reducer;
