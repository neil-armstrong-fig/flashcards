import {selectCardsDueToday} from "@src/redux/slices/study/selectors/SelectCardsDueToday";
import {selectCardsReviewedToday} from "@src/redux/slices/study/selectors/SelectCardsReviewedToday";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** Today at a glance: what is waiting to be reviewed, and how many cards have been reviewed against the daily goal. */
export function StudySummary(): React.JSX.Element {
  const dailyGoalCards = useAppSelector(state => state.settings.dailyGoalCards);
  const cardsDueToday = useAppSelector(selectCardsDueToday);
  const cardsReviewedToday = useAppSelector(selectCardsReviewedToday);
  const goalMet = cardsReviewedToday >= dailyGoalCards;

  return (
    <section aria-label="Today" className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-ground-raised p-4">
        <p className="text-sm text-ink-muted">Due today</p>

        <p data-testid="cards-due-today" className="text-3xl font-semibold text-accent">
          {cardsDueToday}
        </p>
      </div>

      <div className="rounded-xl bg-ground-raised p-4">
        <p className="text-sm text-ink-muted">Reviewed of daily goal</p>

        <p className="text-3xl font-semibold text-accent">
          <span data-testid="cards-reviewed-today">{cardsReviewedToday}</span>
          <span aria-hidden="true"> / </span>
          <span data-testid="daily-goal">{dailyGoalCards}</span>
        </p>

        {goalMet && (
          <p data-testid="daily-goal-met" className="text-sm text-ink-muted">
            Goal met for today
          </p>
        )}
      </div>
    </section>
  );
}
