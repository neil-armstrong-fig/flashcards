import {selectDeckStudyOnlyCount} from "@src/redux/slices/study/selectors/SelectDeckStudyOnlyCount";
import {startSession} from "@src/redux/slices/study/actions/session/thunks/StartSession";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {StudyFocus} from "@flashcards/shared/study/StudyFocus";

interface Props {
  readonly deckId: string;
  readonly focus: Exclude<StudyFocus, "all" | "ahead">;
  /** What a session on the whole deck holds today: the offer is only worth making when it holds fewer. */
  readonly dueToday: number;
}

const LABELS: Record<Props["focus"], string> = {new: "Only new", struggling: "Only struggling"};

/** Offers a session on just part of the deck's day, and only when that really is part of it: otherwise it would be the same as Study. */
export function StudyOnlyButton({deckId, focus, dueToday}: Props): React.JSX.Element | undefined {
  const dispatch = useAppDispatch();
  const count = useAppSelector(state => selectDeckStudyOnlyCount(state, deckId, focus));

  if (count === 0 || count >= dueToday) {
    return undefined;
  }

  return (
    <button
      type="button"
      data-testid={`study-only-${focus}-${deckId}`}
      onClick={() => dispatch(startSession(deckId, focus))}
      className="rounded-full bg-ground px-3 py-2 text-sm"
    >
      {LABELS[focus]} (<span data-testid={`study-only-count-${focus}-${deckId}`}>{count}</span>)
    </button>
  );
}
