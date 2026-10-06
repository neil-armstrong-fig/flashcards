import {nextPreviewCard} from "@src/redux/slices/study/actions/answering/thunks/NextPreviewCard";
import {useAppDispatch} from "@src/redux/shared/Hooks";

/** Moves on from a card in a look ahead, in place of the ratings: there is nothing to rate, as nothing is kept. */
export function PreviewNextButton(): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      data-testid="preview-next"
      onClick={() => dispatch(nextPreviewCard())}
      className="rounded-xl bg-accent px-4 py-4 text-lg font-semibold text-ground"
    >
      Next
    </button>
  );
}
