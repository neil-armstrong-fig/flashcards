import {DeckSpeedSetting} from "@src/react/pages/settings/components/deck-settings/components/deck-settings-of-deck/components/deck-speed-setting/DeckSpeedSetting";
import {DeckVoiceSetting} from "@src/react/pages/settings/components/deck-settings/components/deck-settings-of-deck/components/deck-voice-setting/DeckVoiceSetting";
import {
  limitsUnlockedChosen,
  maxReviewsPerDayChosen,
  newCardsPerDayChosen,
} from "@src/redux/slices/settings/SettingsSlice";
import {MAX_REVIEWS_PER_DAY_LIMITS, NEW_CARDS_PER_DAY_LIMITS} from "@src/redux/slices/settings/limits/SettingLimits";
import {NumberSetting} from "@src/react/pages/settings/components/number-setting/NumberSetting";
import {selectDeckLimits} from "@src/redux/slices/settings/selectors/SelectDeckLimits";
import {ToggleSetting} from "@src/react/pages/settings/components/toggle-setting/ToggleSetting";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

interface Props {
  readonly deckId: string;
  readonly name: string;
}

/** The new-cards and reviews limits of one deck, with how it is heard. */
export function DeckSettingsOfDeck({deckId, name}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const limits = useAppSelector(state => selectDeckLimits(state, deckId));
  const locked = !limits.limitsUnlocked;

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
        key={locked ? limits.maxReviewsPerDay : "unlocked"}
        label="Maximum reviews per day"
        testId={`max-reviews-per-day-${deckId}`}
        value={limits.maxReviewsPerDay}
        min={MAX_REVIEWS_PER_DAY_LIMITS.min}
        max={MAX_REVIEWS_PER_DAY_LIMITS.max}
        disabled={locked}
        onChange={count => dispatch(maxReviewsPerDayChosen({deckId, count}))}
      />

      <ToggleSetting
        label="Unlock reviews per day"
        description="Locked, reviews are ten for each new card, which keeps the daily work in balance. Unlock to set them yourself."
        testId={`limits-unlocked-${deckId}`}
        checked={limits.limitsUnlocked}
        onChange={unlocked => dispatch(limitsUnlockedChosen({deckId, unlocked}))}
      />

      <DeckVoiceSetting deckId={deckId} />

      <DeckSpeedSetting deckId={deckId} />
    </section>
  );
}
