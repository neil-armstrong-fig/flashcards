import {selectCurrentCardNote} from "@src/redux/slices/card-notes/selectors/SelectCardNote";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** The note on the card on screen. Writing or removing it is in the more options. */
export function NoteText(): React.JSX.Element | undefined {
  const cardId = useAppSelector(state => state.study.session?.currentCardId);
  const note = useAppSelector(selectCurrentCardNote);

  if (cardId === undefined || note === undefined) {
    return undefined;
  }

  return (
    <p data-testid="note-text" className="text-center text-sm text-ink-muted">
      {note}
    </p>
  );
}
