import type {RootState} from "@src/redux/Store";

/** Whether the session is a look ahead at cards not yet due, whose answers are not kept. */
export function selectLookingAhead(state: RootState): boolean {
  return state.study.session?.focus.kind === "ahead";
}
