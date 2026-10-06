import {selectLookingAhead} from "@src/redux/slices/study/selectors/SelectLookingAhead";
import {AudioSwitches} from "@src/react/pages/review/components/card-review/components/audio-switches/AudioSwitches";
import {NoteText} from "@src/react/pages/review/components/card-review/components/note-text/NoteText";
import {MoreOptions} from "@src/react/pages/review/components/card-review/components/more-options/MoreOptions";
import {CardPicture} from "@src/react/pages/review/components/card-review/components/card-picture/CardPicture";
import {FadeOffer} from "@src/react/pages/review/components/card-review/components/fade-offer/FadeOffer";
import {AidPrompt} from "@src/react/pages/review/components/card-review/components/aid-prompt/AidPrompt";
import {Explanation} from "@src/react/pages/review/components/card-review/components/explanation/Explanation";
import {CardFace} from "@src/react/pages/review/components/card-review/components/card-face/CardFace";
import {PreviewNextButton} from "@src/react/pages/review/components/card-review/components/preview-next-button/PreviewNextButton";
import {RatingButtons} from "@src/react/pages/review/components/card-review/components/rating-buttons/RatingButtons";
import {Similars} from "@src/react/pages/review/components/card-review/components/similars/Similars";
import {ReplayButton} from "@src/react/pages/review/components/card-review/components/replay-button/ReplayButton";
import {ShowAnswerButton} from "@src/react/pages/review/components/card-review/components/show-answer-button/ShowAnswerButton";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** The card on screen and what the learner can do with it: reveal the answer, then rate how well they knew it. */
export function CardReview(): React.JSX.Element {
  const answerShown = useAppSelector(state => state.study.session?.answerShown === true);
  const lookingAhead = useAppSelector(selectLookingAhead);

  return (
    <section className="flex flex-1 flex-col justify-between gap-6">
      <CardFace />

      <div className="flex flex-col gap-3">
        <ReplayButton />

        <AudioSwitches />

        {answerShown && <Similars />}

        {answerShown && <Explanation />}
      </div>

      {!lookingAhead && <AidPrompt />}

      {!lookingAhead && <FadeOffer />}

      <CardPicture />

      <NoteText />

      {!lookingAhead && <MoreOptions />}

      {answerShown && !lookingAhead && <RatingButtons />}

      {answerShown && lookingAhead && <PreviewNextButton />}

      {!answerShown && <ShowAnswerButton />}
    </section>
  );
}
