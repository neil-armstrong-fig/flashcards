import {ShapeSimilarsWarning} from "@src/react/pages/review/components/card-review/components/similars/components/shape-similars-warning/ShapeSimilarsWarning";
import {selectCurrentSimilars} from "@src/redux/slices/similar/selectors/SelectCurrentSimilars";
import {SoundSimilars} from "@src/react/pages/review/components/card-review/components/similars/components/sound-similars/SoundSimilars";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** What the card on screen is easily mixed up with: the sounds it can be compared with, and the characters like its shape. */
export function Similars(): React.JSX.Element {
  const currentCardId = useAppSelector(state => state.study.session?.currentCardId);
  const hasSound = useAppSelector(state => selectCurrentSimilars(state).sound !== undefined);
  const hasShape = useAppSelector(state => selectCurrentSimilars(state).shape.length > 0);

  return (
    <>
      {hasSound && <SoundSimilars key={currentCardId} />}

      {hasShape && <ShapeSimilarsWarning />}
    </>
  );
}
