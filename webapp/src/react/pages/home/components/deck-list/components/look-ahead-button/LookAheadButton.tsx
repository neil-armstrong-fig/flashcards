import {selectDeckAheadCount} from "@src/redux/slices/study/selectors/SelectDeckAheadCount";
import {useAppSelector} from "@src/redux/shared/Hooks";
import {useStartSession} from "@src/react/pages/home/components/deck-list/hooks/use-start-session/UseStartSession";

interface Props {
  readonly deckId: string;
}

/** Offers a look at the cards that are not due for days, to see them again early: their answers change nothing. Only when there are some. */
export function LookAheadButton({deckId}: Props): React.JSX.Element | undefined {
  const start = useStartSession();
  const count = useAppSelector(state => selectDeckAheadCount(state, deckId));

  if (count === 0) {
    return undefined;
  }

  return (
    <button
      type="button"
      data-testid={`look-ahead-${deckId}`}
      onClick={() => start(deckId, "ahead")}
      className="min-h-11 rounded-full bg-ground px-4 py-2 text-sm"
    >
      Look ahead (<span data-testid={`look-ahead-count-${deckId}`}>{count}</span>)
    </button>
  );
}
