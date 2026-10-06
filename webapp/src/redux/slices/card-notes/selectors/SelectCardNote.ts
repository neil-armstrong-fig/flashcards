import type {RootState} from "@src/redux/Store";

/** The note on the card now on screen, or nothing when it has none or no session is open. */
export function selectCurrentCardNote(state: RootState): string | undefined {
  const id = state.study.session?.currentCardId;

  if (id === undefined) {
    return undefined;
  }

  return state.cardNotes.byCard[id];
}
