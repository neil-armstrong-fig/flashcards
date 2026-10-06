import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import {INITIAL_CARD_NOTES_STATE} from "@src/redux/slices/card-notes/initial-state/InitialCardNotesState";
import {MAXIMUM_NOTE_LENGTH} from "@src/redux/slices/card-notes/limits/MaximumNoteLength";

interface NoteWritten {
  readonly cardId: string;
  readonly text: string;
  readonly addedAt: string;
}

interface NoteRenewed {
  readonly cardId: string;
  readonly addedAt: string;
}

const cardNotesSlice = createSlice({
  name: "cardNotes",
  initialState: INITIAL_CARD_NOTES_STATE,
  reducers: {
    noteWritten: (state, action: PayloadAction<NoteWritten>) => {
      const {cardId} = action.payload;
      const text = action.payload.text.trim().slice(0, MAXIMUM_NOTE_LENGTH);

      if (text === "") {
        delete state.byCard[cardId];
        delete state.addedAt[cardId];
        return;
      }

      state.byCard[cardId] = text;
      state.addedAt[cardId] = action.payload.addedAt;
    },
    noteRenewed: (state, action: PayloadAction<NoteRenewed>) => {
      if (state.byCard[action.payload.cardId] !== undefined) {
        state.addedAt[action.payload.cardId] = action.payload.addedAt;
      }
    },
    noteRemoved: (state, action: PayloadAction<string>) => {
      delete state.byCard[action.payload];
      delete state.addedAt[action.payload];
    },
  },
});

export const {noteRemoved, noteRenewed, noteWritten} = cardNotesSlice.actions;
export const cardNotesReducer = cardNotesSlice.reducer;
