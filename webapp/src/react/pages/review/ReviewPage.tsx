import {CardReview} from "@src/react/pages/review/components/card-review/CardReview";
import {ReviewHeader} from "@src/react/pages/review/components/review-header/ReviewHeader";
import {SessionComplete} from "@src/react/pages/review/components/session-complete/SessionComplete";
import {useAppSelector} from "@src/redux/shared/Hooks";
import {useTapToPlay} from "@src/react/audio/hooks/use-tap-to-play/UseTapToPlay";
import {useCardAudio} from "@src/react/audio/hooks/use-card-audio/UseCardAudio";
import {useReviewShortcuts} from "@src/react/pages/review/hooks/use-review-shortcuts/UseReviewShortcuts";

/** One review session: a card at a time until everything due is done. */
export function ReviewPage(): React.JSX.Element {
  const hasCard = useAppSelector(state => state.study.session?.currentCardId !== undefined);

  const tapToPlay = useTapToPlay();

  useCardAudio();
  useReviewShortcuts();

  return (
    <main
      data-testid="review-screen"
      onClick={tapToPlay}
      className="mx-auto flex min-h-dvh max-w-xl flex-col gap-4 p-4"
    >
      <ReviewHeader />

      {hasCard && <CardReview />}

      {!hasCard && <SessionComplete />}
    </main>
  );
}
