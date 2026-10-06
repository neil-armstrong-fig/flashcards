import type {RootState} from "@src/redux/Store";

/** The address of the picture on the card now on screen, or nothing when it has none or no session is open. */
export function selectCurrentCardPicture(state: RootState): string | undefined {
  const id = state.study.session?.currentCardId;

  if (id === undefined) {
    return undefined;
  }

  return state.cardPictures.byCard[id];
}
