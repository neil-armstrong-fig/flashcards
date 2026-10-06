import type {RootState} from "@src/redux/Store";
import type {ThunkAction, UnknownAction} from "@reduxjs/toolkit";

export type AppThunk<Result = void> = ThunkAction<Result, RootState, undefined, UnknownAction>;
