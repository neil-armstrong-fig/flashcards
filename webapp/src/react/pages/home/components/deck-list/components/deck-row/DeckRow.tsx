import {KeepOffline} from "@src/react/pages/home/components/deck-list/components/keep-offline/KeepOffline";
import {LookAheadButton} from "@src/react/pages/home/components/deck-list/components/look-ahead-button/LookAheadButton";
import {StudyOnlyButton} from "@src/react/pages/home/components/deck-list/components/study-only-button/StudyOnlyButton";
import {selectDeckDueCounts} from "@src/redux/slices/study/selectors/SelectDeckDueCounts";
import {selectDeckCardsDueToday} from "@src/redux/slices/study/selectors/SelectDeckCardsDueToday";
import {startSession} from "@src/redux/slices/study/actions/session/thunks/StartSession";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

interface Props {
  readonly deckId: string;
  readonly name: string;
}

/** One deck: what is waiting in it today, a button to study it, the narrower ways to study it, and keeping it offline. */
export function DeckRow({deckId, name}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const due = useAppSelector(state => selectDeckCardsDueToday(state, deckId));
  const counts = useAppSelector(state => selectDeckDueCounts(state, deckId));

  return (
    <li data-testid={`deck-${deckId}`} className="flex flex-col gap-3 rounded-xl bg-ground-raised p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-semibold">{name}</span>

          <span className="text-sm text-ink-muted">
            <span data-testid={`deck-due-${deckId}`}>{due}</span> due today
          </span>

          <span className="text-sm text-ink-muted">
            <span data-testid={`deck-new-${deckId}`}>{counts.new}</span> new,{" "}
            <span data-testid={`deck-learning-${deckId}`}>{counts.learning}</span> to learn,{" "}
            <span data-testid={`deck-review-${deckId}`}>{counts.review}</span> to review
          </span>
        </div>

        <button
          type="button"
          data-testid={`start-reviewing-${deckId}`}
          onClick={() => dispatch(startSession(deckId))}
          className="rounded-xl bg-accent px-4 py-3 text-lg font-semibold text-ground"
        >
          Study
        </button>
      </div>

      <div className="flex gap-2">
        <StudyOnlyButton deckId={deckId} focus="new" dueToday={due} />

        <StudyOnlyButton deckId={deckId} focus="struggling" dueToday={due} />

        <LookAheadButton deckId={deckId} />
      </div>

      <KeepOffline deckId={deckId} />
    </li>
  );
}
