import {useEffect, useRef} from "react";
import {addCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/AddCardPicture";
import {removeCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/RemoveCardPicture";
import {selectCurrentCardPicture} from "@src/redux/slices/card-pictures/selectors/SelectCardPicture";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** The learner's own picture for the card on screen: shows it, and lets them choose, paste or remove one. */
export function CardPicture(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const picture = useAppSelector(selectCurrentCardPicture);
  const error = useAppSelector(state => state.cardPictures.error);
  const loaded = useAppSelector(state => state.cardPictures.loaded);
  const chooserRef = useRef<HTMLInputElement>(null);

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
    <div className="flex flex-col items-center gap-2">
      {picture !== undefined && (
        <div className="flex flex-col items-center gap-1">
          <img data-testid="picture" src={picture} alt="Your picture for this card" className="max-h-40 rounded" />

          <button
            type="button"
            data-testid="picture-remove"
            onClick={() => void dispatch(removeCardPicture())}
            className="text-sm text-ink-muted underline"
          >
            Remove picture
          </button>
        </div>
      )}

      {picture === undefined && (
        <button type="button" onClick={() => chooserRef.current?.click()} className="text-sm text-ink-muted underline">
          Add a picture
        </button>
      )}

      <input
        ref={chooserRef}
        type="file"
        accept="image/*"
        data-testid="picture-input"
        aria-label="Choose a picture for this card"
        className="hidden"
        onChange={event => {
          const file = event.target.files?.[0];

          event.target.value = "";

          if (file !== undefined) {
            void dispatch(addCardPicture(file));
          }
        }}
      />

      {error !== undefined && (
        <p data-testid="picture-error" role="alert" className="text-sm text-ink-muted">
          {error}
        </p>
      )}
    </div>
  );
}
