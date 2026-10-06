import type {AccountStatus} from "@src/redux/slices/account/types/AccountStatus";

export interface AccountState {
  readonly status: AccountStatus;
  /**
   * Who is signed in, or who was the last time the API could be asked (kept on the device): so that a learner who has signed in
   * before can still open the app where the API cannot be reached.
   */
  readonly email?: string;
}
