import {useEffect} from "react";
import {addCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/AddCardPicture";
import {selectCurrentCardPicture} from "@src/redux/slices/card-pictures/selectors/SelectCardPicture";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** The learner's own picture for the card on screen: shows it, and takes one pasted in. Choosing or removing one is in the more options. */
export function CardPicture(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const picture = useAppSelector(selectCurrentCardPicture);
  const loaded = useAppSelector(state => state.cardPictures.loaded);

  useEffect(() => {
    function onPaste(event: ClipboardEvent): void {
      const file = [...(event.clipboardData?.files ?? [])][0];

      if (file === undefined) {
        return;
      }

      void dispatch(addCardPicture(file));
    }

    document.addEventListener("paste", onPaste);

    return () => document.removeEventListener("paste", onPaste);
  }, [dispatch]);

  if (!loaded) {
    return <></>;
  }

  return (
    <div data-testid="picture-area" className="flex flex-col items-center">
      {picture !== undefined && (
        <img data-testid="picture" src={picture} alt="Your picture for this card" className="max-h-40 rounded" />
      )}
    </div>
  );
}
