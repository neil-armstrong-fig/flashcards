import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import {INITIAL_SIMILAR_STATE} from "@src/redux/slices/similar/initial-state/InitialSimilarState";

interface WordAdded {
  readonly noteId: string;
  readonly text: string;
}

const similarSlice = createSlice({
  name: "similar",
  initialState: INITIAL_SIMILAR_STATE,
  reducers: {
    addingStarted: state => {
      state.adding = true;
      state.error = undefined;
    },

    addingFailed: (state, action: PayloadAction<string>) => {
      state.adding = false;
      state.error = action.payload;
    },

    wordRemoved: (state, action: PayloadAction<WordAdded>) => {
      const {noteId, text} = action.payload;

      state.words[noteId] = (state.words[noteId] ?? []).filter(word => word !== text);
      state.error = undefined;
    },

    noteCleared: (state, action: PayloadAction<string>) => {
      delete state.words[action.payload];
    },

    wordAdded: (state, action: PayloadAction<WordAdded>) => {
      const {noteId, text} = action.payload;

      state.words[noteId] = [...(state.words[noteId] ?? []), text];
      state.adding = false;
      state.error = undefined;
    },
  },
});

export const {addingStarted, addingFailed, noteCleared, wordAdded, wordRemoved} = similarSlice.actions;
export const similarReducer = similarSlice.reducer;
