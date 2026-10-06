import {noteRemoved} from "@src/redux/slices/card-notes/CardNotesSlice";
import {selectCurrentCardNote} from "@src/redux/slices/card-notes/selectors/SelectCardNote";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** The note on the card on screen, with a way to take it off. */
export function NoteText(): React.JSX.Element | undefined {
  const dispatch = useAppDispatch();
  const cardId = useAppSelector(state => state.study.session?.currentCardId);
  const note = useAppSelector(selectCurrentCardNote);

  if (cardId === undefined || note === undefined) {
    return undefined;
  }

  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <p data-testid="note-text" className="text-ink-muted">
        {note}
      </p>

      <button
        type="button"
        data-testid="note-remove"
        onClick={() => dispatch(noteRemoved(cardId))}
        className="shrink-0 text-ink-muted underline"
      >
        Remove
      </button>
    </div>
  );
}
