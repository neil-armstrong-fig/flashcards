import {createSlice} from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {AccountState} from "@src/redux/slices/account/types/AccountState";

const INITIAL_ACCOUNT_STATE: AccountState = {status: "unknown"};

const accountSlice = createSlice({
  name: "account",
  initialState: INITIAL_ACCOUNT_STATE,
  reducers: {
    signedIn: (_state, action: PayloadAction<string>): AccountState => ({status: "signedIn", email: action.payload}),
    signedOut: (): AccountState => ({status: "signedOut"}),
    unreachable: (state): AccountState => ({status: "unreachable", email: state.email}),
  },
});

export const {signedIn, signedOut, unreachable} = accountSlice.actions;
export const accountReducer = accountSlice.reducer;
