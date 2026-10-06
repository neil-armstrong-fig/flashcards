import type {Access} from "@src/redux/slices/account/types/Access";
import type {RootState} from "@src/redux/Store";

/**
 * The whole app is behind Google sign-in. It is open to someone signed in, and also to someone who has signed in on this device
 * before when the API cannot be reached, so an offline phone keeps working; but never to someone signed out, and never to a device
 * that has never signed in and cannot reach the API to do so.
 */
export function selectAccess(state: RootState): Access {
  const {status, email} = state.account;

  if (status === "unknown") {
    return "checking";
  }

  if (status === "signedIn") {
    return "open";
  }

  if (status === "unreachable" && email !== undefined) {
    return "open";
  }

  if (status === "unreachable") {
    return "unreachable";
  }

  return "signIn";
}
