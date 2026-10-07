import type {RootState} from "@src/redux/Store";

/** Who is signed in right now, or `undefined` when nobody is (or the API has not said who). */
export function selectSignedInEmail(state: RootState): string | undefined {
  if (state.account.status !== "signedIn") {
    return undefined;
  }

  return state.account.email;
}
