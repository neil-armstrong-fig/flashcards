import {selectLookingAhead} from "@src/redux/slices/study/selectors/SelectLookingAhead";
import {selectSessionCardsRemaining} from "@src/redux/slices/study/selectors/SelectSessionCardsRemaining";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** How much is left in the session. */
export function ReviewHeader(): React.JSX.Element {
  const hasCard = useAppSelector(state => state.study.session?.currentCardId !== undefined);
  const remaining = useAppSelector(selectSessionCardsRemaining);
  const lookingAhead = useAppSelector(selectLookingAhead);

  return (
    <header className="flex flex-col gap-1 text-ink-muted">
      {lookingAhead && (
        <p data-testid="preview-notice" className="text-sm">
          Looking ahead: these answers are not kept and nothing is rescheduled.
        </p>
      )}

      {hasCard && (
        <p>
          Remaining: <span data-testid="cards-remaining">{remaining}</span>
        </p>
      )}
    </header>
  );
}
