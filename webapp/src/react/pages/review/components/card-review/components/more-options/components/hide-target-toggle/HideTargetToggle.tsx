import {deckTargetHiddenChosen} from "@src/redux/slices/settings/SettingsSlice";
import {selectDeckPreferences} from "@src/redux/slices/settings/selectors/SelectDeckPreferences";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/**
 * Keeps the target-language word off the front of this deck's cards when it comes first, so the learner can lean on the sound when
 * they are sure of the words, and turn the word back on when they are not or have no sound. The choice is the deck's, and kept.
 */
export function HideTargetToggle(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const deckId = useAppSelector(state => state.study.session?.deckId);
  const hidden = useAppSelector(state => deckId !== undefined && selectDeckPreferences(state, deckId).hideTarget);

  return (
    <label className="flex w-full items-center justify-between gap-4 rounded-xl bg-ground p-4">
      <span className="flex flex-col gap-1">
        Hide the word when it comes first
        <span className="text-sm text-ink-muted">
          Listen to the card and keep the word hidden until you show the answer.
        </span>
      </span>

      <input
        type="checkbox"
        data-testid="hide-target"
        checked={hidden}
        disabled={deckId === undefined}
        onChange={event => {
          if (deckId !== undefined) {
            dispatch(deckTargetHiddenChosen({deckId, hidden: event.currentTarget.checked}));
          }
        }}
        className="size-6 accent-accent"
      />
    </label>
  );
}
