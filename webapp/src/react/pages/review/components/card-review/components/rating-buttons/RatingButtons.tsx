import {answerCard} from "@src/redux/slices/study/actions/answering/thunks/AnswerCard";
import {buzz} from "@src/haptics/Buzz";
import {formatInterval} from "@src/react/pages/shared/utils/FormatInterval";
import {RATINGS} from "@flashcards/shared/study/Rating";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {Rating} from "@flashcards/shared/study/Rating";

const RATING_LABELS = {again: "Again", hard: "Hard", good: "Good", easy: "Easy"} as const satisfies Record<
  Rating,
  string
>;

/** The four ways to say how well the card was known, each with when the card would come back. Disabled while saving. Pressed, a button shrinks and the phone ticks. */
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
          onClick={() => {
            buzz();
            void dispatch(answerCard(rating));
          }}
          className="group flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl bg-ground-raised px-2 py-3 font-semibold transition-transform active:scale-95 active:bg-accent active:text-ground motion-reduce:transition-none"
        >
          <span
            data-testid={`rate-${rating}-interval`}
            className="text-xs font-normal text-ink-muted group-active:text-ground"
          >
            {intervals && formatInterval(intervals[rating])}
          </span>

          {RATING_LABELS[rating]}
        </button>
      ))}
    </div>
  );
}
