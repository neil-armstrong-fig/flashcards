import type {RootState} from "@src/redux/Store";

/** Whether someone is signed in right now, which is what adding, editing and asking for more need. */
export function selectSignedIn(state: RootState): boolean {
  return state.account.status === "signedIn";
}
