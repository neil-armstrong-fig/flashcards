import {KeepOffline} from "@src/react/pages/home/components/deck-list/components/keep-offline/KeepOffline";
import {LookAheadButton} from "@src/react/pages/home/components/deck-list/components/look-ahead-button/LookAheadButton";
import {StudyOnlyButton} from "@src/react/pages/home/components/deck-list/components/study-only-button/StudyOnlyButton";
import {selectDeckDueCounts} from "@src/redux/slices/study/selectors/SelectDeckDueCounts";
import {selectDeckCardsDueToday} from "@src/redux/slices/study/selectors/SelectDeckCardsDueToday";
import {useAppSelector} from "@src/redux/shared/Hooks";
import {useStartSession} from "@src/react/pages/home/components/deck-list/hooks/use-start-session/UseStartSession";
import clsx from "clsx";

interface Props {
  readonly deckId: string;
  readonly name: string;
}

/** One deck: what is waiting in it today, a button to study it, the narrower ways to study it, and keeping it offline. */
export function DeckRow({deckId, name}: Props): React.JSX.Element {
  const start = useStartSession();
  const due = useAppSelector(state => selectDeckCardsDueToday(state, deckId));
  const counts = useAppSelector(state => selectDeckDueCounts(state, deckId));

  return (
    <li
      data-testid={`deck-${deckId}`}
      className={clsx(
        "flex flex-col gap-3 rounded-xl border-2 bg-ground-raised p-4",
        due > 0 && "border-accent",
        due === 0 && "border-transparent",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="flex items-center gap-2 font-semibold">
            {name}

            {due > 0 && (
              <span
                data-testid={`deck-due-highlight-${deckId}`}
                className="rounded-full bg-accent px-2 py-0.5 text-xs text-ground"
              >
                Due
              </span>
            )}
          </span>

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
          onClick={() => start(deckId)}
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
