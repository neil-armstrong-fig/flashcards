import {selectCurrentExplanation} from "@src/redux/slices/deck/selectors/SelectCurrentExplanation";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** Says why the card on screen exists, for a rare kana that needs it. Nothing when its note has no explanation. */
export function Explanation(): React.JSX.Element | undefined {
  const explanation = useAppSelector(selectCurrentExplanation);

  if (explanation === "") {
    return undefined;
  }

  return (
    <p data-testid="card-explanation" className="text-center text-sm text-ink-muted">
      {explanation}
    </p>
  );
}
