import {useRef} from "react";
import {addCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/AddCardPicture";
import {removeCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/RemoveCardPicture";
import {selectCurrentCardPicture} from "@src/redux/slices/card-pictures/selectors/SelectCardPicture";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** Lets the learner choose, or remove, their own picture for the card on screen. The picture itself is shown on the card. */
export function PictureControls(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const picture = useAppSelector(selectCurrentCardPicture);
  const error = useAppSelector(state => state.cardPictures.error);
  const chooserRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex w-full flex-col gap-2">
      {picture !== undefined && (
        <button
          type="button"
          data-testid="picture-remove"
          onClick={() => void dispatch(removeCardPicture())}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-ground px-4 py-3"
        >
          Remove picture
        </button>
      )}

      {picture === undefined && (
        <button
          type="button"
          data-testid="picture-add"
          onClick={() => chooserRef.current?.click()}
          className="flex min-h-12 w-full items-center justify-center rounded-xl bg-ground px-4 py-3"
        >
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
