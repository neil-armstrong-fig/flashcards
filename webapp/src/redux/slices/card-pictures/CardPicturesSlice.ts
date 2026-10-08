import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {KeptPicture} from "@src/storage/index-db/pictures/types/KeptPicture";
import {INITIAL_CARD_PICTURES_STATE} from "@src/redux/slices/card-pictures/initial-state/InitialCardPicturesState";

interface PictureKept {
  readonly cardId: string;
  readonly address: string;
  readonly addedAt: string;
}

interface PictureRenewed {
  readonly cardId: string;
  readonly addedAt: string;
}

const cardPicturesSlice = createSlice({
  name: "cardPictures",
  initialState: INITIAL_CARD_PICTURES_STATE,
  reducers: {
    picturesLoaded: (state, action: PayloadAction<Readonly<Record<string, KeptPicture>>>) => {
      for (const [cardId, picture] of Object.entries(action.payload)) {
        if (state.byCard[cardId] === undefined) {
          state.byCard[cardId] = picture.address;
          state.addedAt[cardId] = picture.addedAt;
        }
      }

      state.loaded = true;
    },
    pictureKept: (state, action: PayloadAction<PictureKept>) => {
      state.byCard[action.payload.cardId] = action.payload.address;
      state.addedAt[action.payload.cardId] = action.payload.addedAt;
      state.error = undefined;
    },
    pictureRenewed: (state, action: PayloadAction<PictureRenewed>) => {
      if (state.byCard[action.payload.cardId] !== undefined) {
        state.addedAt[action.payload.cardId] = action.payload.addedAt;
      }
    },
    pictureRemoved: (state, action: PayloadAction<string>) => {
      delete state.byCard[action.payload];
      delete state.addedAt[action.payload];
      state.error = undefined;
    },
    pictureRefused: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {pictureKept, pictureRefused, pictureRemoved, pictureRenewed, picturesLoaded} = cardPicturesSlice.actions;
export const cardPicturesReducer = cardPicturesSlice.reducer;
