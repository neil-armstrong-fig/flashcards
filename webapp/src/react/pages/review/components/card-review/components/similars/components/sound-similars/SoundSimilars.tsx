import clsx from "clsx";
import {useState} from "react";
import {SimilarPanel} from "@src/react/components/similar-panel/SimilarPanel";
import {selectCurrentSimilars} from "@src/redux/slices/similar/selectors/SelectCurrentSimilars";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** A button on a card that opens its word's similars (`SimilarPanel`). Closed until opened, and closed again on every new card. */
export function SoundSimilars(): React.JSX.Element | undefined {
  const similar = useAppSelector(state => selectCurrentSimilars(state).sound);
  const [open, setOpen] = useState(false);

  if (!similar) {
    return undefined;
  }

  const hasSimilars = similar.words.length > 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        data-testid="similar-open"
        aria-expanded={open}
        data-has-similars={hasSimilars}
        onClick={() => setOpen(!open)}
        className={clsx(
          "min-h-11 rounded-full px-4 py-2 text-sm",
          hasSimilars && "bg-accent font-semibold text-ground",
          !hasSimilars && "bg-ground-raised",
        )}
      >
        Compare sounds
      </button>

      {open && <SimilarPanel noteId={similar.noteId} />}
    </div>
  );
}
