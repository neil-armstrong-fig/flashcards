import {createSlice} from "@reduxjs/toolkit";
import {ALL_DECKS} from "@src/redux/slices/browse/rows/AllDecks";
import type {BrowseState} from "@src/redux/slices/browse/types/BrowseState";
import type {DeckFilter} from "@src/redux/slices/browse/types/DeckFilter";
import type {PayloadAction} from "@reduxjs/toolkit";

const INITIAL_BROWSE_STATE: BrowseState = {query: "", deck: ALL_DECKS};

/** The view of the list of every card, which is gone again when the learner leaves it. */
const browseSlice = createSlice({
  name: "browse",
  initialState: INITIAL_BROWSE_STATE,
  reducers: {
    queryChanged: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },

    deckFilterChosen: (state, action: PayloadAction<DeckFilter>) => {
      state.deck = action.payload;
    },

    /** Opens a row's similars, or closes them where they were open. */
    similarsToggled: (state, action: PayloadAction<string>) => {
      state.similarsOpenFor = state.similarsOpenFor === action.payload ? undefined : action.payload;
    },

    browseLeft: () => INITIAL_BROWSE_STATE,
  },
});

export const {queryChanged, deckFilterChosen, similarsToggled, browseLeft} = browseSlice.actions;
export const browseReducer = browseSlice.reducer;
