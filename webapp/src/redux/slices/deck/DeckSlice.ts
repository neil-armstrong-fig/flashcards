import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import {INITIAL_DECK_STATE} from "@src/redux/slices/deck/initial-state/InitialDeckState";
import type {DeckState} from "@src/redux/slices/deck/types/DeckState";
import type {VocabNote} from "@language-learning/content/types/VocabNote";

const deckSlice = createSlice({
  name: "deck",
  initialState: INITIAL_DECK_STATE,
  reducers: {
    addingStarted: state => {
      state.adding = true;
      state.error = undefined;
    },

    failed: (state, action: PayloadAction<string>) => {
      state.adding = false;
      state.error = action.payload;
    },

    noteAdded: (state, action: PayloadAction<VocabNote>): DeckState => ({
      ...state,
      notes: [...state.notes, action.payload],
      adding: false,
      error: undefined,
    }),

    editingStarted: state => {
      state.adding = true;
      state.editError = undefined;
    },

    editFailed: (state, action: PayloadAction<string>) => {
      state.adding = false;
      state.editError = action.payload;
    },

    noteEdited: (state, action: PayloadAction<VocabNote>): DeckState => ({
      ...state,
      notes: state.notes.map(note => (note.id === action.payload.id ? action.payload : note)),
      adding: false,
      editError: undefined,
    }),

    noteRemoved: (state, action: PayloadAction<string>): DeckState => ({
      ...state,
      notes: state.notes.filter(note => note.id !== action.payload),
      error: undefined,
    }),
  },
});

export const {addingStarted, failed, noteAdded, editingStarted, editFailed, noteEdited, noteRemoved} =
  deckSlice.actions;
export const deckReducer = deckSlice.reducer;
