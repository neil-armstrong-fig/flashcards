import {selectDeckPreferences} from "@src/redux/slices/settings/selectors/SelectDeckPreferences";
import {selectCardById} from "@src/redux/slices/deck/selectors/SelectCardById";
import {splitAtEmphasis} from "@src/react/pages/review/components/card-review/components/card-face/utils/SplitAtEmphasis";
import {Staff} from "@src/react/components/staff/Staff";
import {SpeakerIcon} from "@src/react/components/speaker-icon/SpeakerIcon";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** The word on the front of the card and, once the answer is shown, what it means. */
export function CardFace(): React.JSX.Element | undefined {
  const currentCardId = useAppSelector(state => state.study.session?.currentCardId);
  const answerShown = useAppSelector(state => state.study.session?.answerShown === true);
  const hideTarget = useAppSelector(state => {
    const deckId = state.study.session?.deckId;

    return deckId !== undefined && selectDeckPreferences(state, deckId).hideTarget;
  });
  const card = useAppSelector(state => selectCardById(state, currentCardId));

  if (!card) {
    return undefined;
  }

  const back = splitAtEmphasis(card.back, card.emphasis);
  // Only a card that shows the target-language word on its front can hide it: the other direction asks for the word, and shows English.
  const frontHidden = hideTarget && card.direction === "to-english" && !answerShown && card.notation === undefined;

  return (
    <div className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-4 text-center">
      <p data-testid="card-front" className="text-6xl">
        {!frontHidden && card.front}

        {card.notation && <Staff notation={card.notation} testId="card-notation" className="w-64 max-w-full" />}

        {frontHidden && (
          <span data-testid="card-front-hidden" role="img" aria-label="Listen to the word" className="text-ink-muted">
            <SpeakerIcon className="size-16" />
          </span>
        )}
      </p>

      {answerShown && (
        <p data-testid="card-back" className="text-2xl text-ink-muted">
          {back.before}
          {back.bold !== "" && <strong className="font-bold text-ink">{back.bold}</strong>}
          {back.after}
          {card.hint !== "" && <span className="text-base"> ({card.hint})</span>}
        </p>
      )}
    </div>
  );
}
