import {maxReviewsPerDayChosen, newCardsPerDayChosen} from "@src/redux/slices/settings/SettingsSlice";
import {MAX_REVIEWS_PER_DAY_LIMITS, NEW_CARDS_PER_DAY_LIMITS} from "@src/redux/slices/settings/limits/SettingLimits";
import {NumberSetting} from "@src/react/pages/settings/components/number-setting/NumberSetting";
import {selectDeckLimits} from "@src/redux/slices/settings/selectors/SelectDeckLimits";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

interface Props {
  readonly deckId: string;
  readonly name: string;
}

/** The new-cards and reviews limits of one deck. */
export function DeckLimitsOfDeck({deckId, name}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const limits = useAppSelector(state => selectDeckLimits(state, deckId));

  return (
    <section aria-label={name} className="flex flex-col gap-3">
      <h2 className="font-semibold">{name}</h2>

      <NumberSetting
        label="New cards per day"
        testId={`new-cards-per-day-${deckId}`}
        value={limits.newCardsPerDay}
        min={NEW_CARDS_PER_DAY_LIMITS.min}
        max={NEW_CARDS_PER_DAY_LIMITS.max}
        onChange={count => dispatch(newCardsPerDayChosen({deckId, count}))}
      />

      <NumberSetting
        label="Maximum reviews per day"
        testId={`max-reviews-per-day-${deckId}`}
        value={limits.maxReviewsPerDay}
        min={MAX_REVIEWS_PER_DAY_LIMITS.min}
        max={MAX_REVIEWS_PER_DAY_LIMITS.max}
        onChange={count => dispatch(maxReviewsPerDayChosen({deckId, count}))}
      />
    </section>
  );
}
