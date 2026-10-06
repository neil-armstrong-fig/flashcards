import {selectCardById} from "@src/redux/slices/deck/selectors/SelectCardById";
import {SpeakerIcon} from "@src/react/components/speaker-icon/SpeakerIcon";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** The word on the front of the card and, once the answer is shown, what it means. */
export function CardFace(): React.JSX.Element | undefined {
  const currentCardId = useAppSelector(state => state.study.session?.currentCardId);
  const answerShown = useAppSelector(state => state.study.session?.answerShown === true);
  const listenOnly = useAppSelector(state => state.settings.listenOnly);
  const card = useAppSelector(state => selectCardById(state, currentCardId));

  if (!card) {
    return undefined;
  }

  // Only a card that shows the Korean word on its front can hide it: the other direction asks for the word, and shows English.
  const frontHidden = listenOnly && card.direction === "to-english" && !answerShown;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <p data-testid="card-front" className="text-6xl">
        {!frontHidden && card.front}

        {frontHidden && (
          <span data-testid="card-front-hidden" role="img" aria-label="Listen to the word" className="text-ink-muted">
            <SpeakerIcon className="size-16" />
          </span>
        )}
      </p>

      {answerShown && (
        <p data-testid="card-back" className="text-2xl text-ink-muted">
          {card.back}
          {card.hint !== "" && <span className="text-base"> ({card.hint})</span>}
        </p>
      )}
    </div>
  );
}
