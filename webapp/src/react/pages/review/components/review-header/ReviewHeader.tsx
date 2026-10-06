import {useLeaveSession} from "@src/react/pages/review/hooks/use-leave-session/UseLeaveSession";
import {selectLookingAhead} from "@src/redux/slices/study/selectors/SelectLookingAhead";
import {selectSessionCardsRemaining} from "@src/redux/slices/study/selectors/SelectSessionCardsRemaining";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** How much is left in the session. */
export function ReviewHeader(): React.JSX.Element {
  const hasCard = useAppSelector(state => state.study.session?.currentCardId !== undefined);
  const remaining = useAppSelector(selectSessionCardsRemaining);
  const lookingAhead = useAppSelector(selectLookingAhead);
  const leaveSession = useLeaveSession();

  return (
    <header className="flex flex-col gap-1 text-ink-muted">
      {lookingAhead && (
        <p data-testid="preview-notice" className="text-sm">
          Looking ahead: these answers are not kept and nothing is rescheduled.
        </p>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          data-testid="leave-session"
          aria-label="Leave the session"
          onClick={leaveSession}
          className="-ml-2 px-2 py-1 text-lg"
        >
          ← Back
        </button>

        {hasCard && (
          <p>
            Remaining: <span data-testid="cards-remaining">{remaining}</span>
          </p>
        )}
      </div>
    </header>
  );
}
