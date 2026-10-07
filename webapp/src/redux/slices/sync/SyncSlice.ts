import {createSlice} from "@reduxjs/toolkit";
import type {SyncState} from "@src/redux/slices/sync/types/SyncState";

const INITIAL_SYNC_STATE: SyncState = {status: "not-synced", localChanges: 0};

const syncSlice = createSlice({
  name: "sync",
  initialState: INITIAL_SYNC_STATE,
  reducers: {
    syncStarted: state => {
      state.status = "syncing";
    },
    syncFinished: state => {
      state.status = "synced";
    },
    localChangeMade: state => {
      state.localChanges += 1;
    },
    syncFailed: state => {
      state.status = "not-synced";
    },
  },
});

export const {syncStarted, syncFinished, syncFailed, localChangeMade} = syncSlice.actions;
export const syncReducer = syncSlice.reducer;
