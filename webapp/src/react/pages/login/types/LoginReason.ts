import type {Access} from "@src/redux/slices/account/types/Access";

/** Why the learner is on the sign-in screen: they have not signed in, or sign-in could not be reached to find out. */
export type LoginReason = Exclude<Access, "checking" | "open">;
