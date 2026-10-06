import {answerCard} from "@src/redux/slices/study/actions/answering/thunks/AnswerCard";
import {formatInterval} from "@src/react/pages/shared/utils/FormatInterval";
import {RATINGS} from "@language-learning/shared/study/Rating";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {Rating} from "@language-learning/shared/study/Rating";

const RATING_LABELS = {again: "Again", hard: "Hard", good: "Good", easy: "Easy"} as const satisfies Record<
  Rating,
  string
>;

/** The four ways to say how well the card was known, each with when the card would come back. Disabled while saving. */
export function RatingButtons(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const saving = useAppSelector(state => state.study.session?.saving === true);
  const intervals = useAppSelector(state => state.study.session?.intervals);

  return (
    <div className="grid grid-cols-4 gap-2">
      {RATINGS.map(rating => (
        <button
          key={rating}
          type="button"
          data-testid={`rate-${rating}`}
          disabled={saving}
          onClick={() => void dispatch(answerCard(rating))}
          className="flex flex-col items-center gap-1 rounded-xl bg-ground-raised px-2 py-3 font-semibold"
        >
          <span data-testid={`rate-${rating}-interval`} className="text-xs font-normal text-ink-muted">
            {intervals && formatInterval(intervals[rating])}
          </span>

          {RATING_LABELS[rating]}
        </button>
      ))}
    </div>
  );
}
