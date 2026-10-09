import {combineReducers, configureStore} from "@reduxjs/toolkit";
import type {Dispatch, Store, ThunkDispatch, UnknownAction} from "@reduxjs/toolkit";
import {accountReducer} from "@src/redux/slices/account/AccountSlice";
import {deckReducer} from "@src/redux/slices/deck/DeckSlice";
import {browseReducer} from "@src/redux/slices/browse/BrowseSlice";
import {cardNotesReducer} from "@src/redux/slices/card-notes/CardNotesSlice";
import {keepCardNotes} from "@src/redux/slices/card-notes/persistence/KeepCardNotes";
import {loadCardNotes} from "@src/redux/slices/card-notes/persistence/LoadCardNotes";
import {cardPicturesReducer} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import {similarReducer} from "@src/redux/slices/similar/SimilarSlice";
import {keepAccount} from "@src/redux/slices/account/persistence/KeepAccount";
import {keepDeck} from "@src/redux/slices/deck/persistence/KeepDeck";
import {loadDeck} from "@src/redux/slices/deck/persistence/LoadDeck";
import {keepSimilar} from "@src/redux/slices/similar/persistence/KeepSimilar";
import {keepSettings} from "@src/redux/slices/settings/persistence/KeepSettings";
import {loadSettings} from "@src/redux/slices/settings/persistence/LoadSettings";
import {loadRememberedAccount} from "@src/redux/slices/account/persistence/LoadRememberedAccount";
import {loadSimilar} from "@src/redux/slices/similar/persistence/LoadSimilar";
import {offlineReducer} from "@src/redux/slices/offline/OfflineSlice";
import {settingsReducer} from "@src/redux/slices/settings/SettingsSlice";
import {syncReducer} from "@src/redux/slices/sync/SyncSlice";
import {studyReducer} from "@src/redux/slices/study/StudySlice";

const rootReducer = combineReducers({
  account: accountReducer,
  browse: browseReducer,
  cardNotes: cardNotesReducer,
  cardPictures: cardPicturesReducer,
  similar: similarReducer,
  deck: deckReducer,
  offline: offlineReducer,
  settings: settingsReducer,
  study: studyReducer,
  sync: syncReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction> & Dispatch<UnknownAction>;
export type AppStore = Store<RootState, UnknownAction> & {dispatch: AppDispatch};

/** The store, with the settings, similar words, cards of their own and who last signed in brought back from this device and kept there from now on. */
export function createStore(audioFillEnabledByDefault = false): AppStore {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      settings: loadSettings(audioFillEnabledByDefault),
      cardNotes: loadCardNotes(),
      similar: loadSimilar(),
      deck: loadDeck(),
      account: loadRememberedAccount(),
    },
  });

  keepSettings(store);
  keepCardNotes(store);
  keepSimilar(store);
  keepDeck(store);
  keepAccount(store);

  return store;
}
