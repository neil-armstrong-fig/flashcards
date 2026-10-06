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

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        data-testid="similar-open"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="rounded-full bg-ground-raised px-4 py-2 text-sm"
      >
        Compare sounds
      </button>

      {open && <SimilarPanel noteId={similar.noteId} />}
    </div>
  );
}
