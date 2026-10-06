import {useState} from "react";
import {removeCustomNote} from "@src/redux/workflows/custom-note/thunks/RemoveCustomNote";
import {useAppDispatch} from "@src/redux/shared/Hooks";

interface Props {
  readonly noteId: string;
}

/** Deletes a card the learner made, which takes both of its directions: pressed once it asks, pressed again it deletes. */
export function DeleteCardButton({noteId}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [asking, setAsking] = useState(false);

  if (asking) {
    return (
      <button
        type="button"
        data-testid="browse-card-delete-confirm"
        onClick={() => void dispatch(removeCustomNote(noteId))}
        className="self-start text-sm text-ink-muted underline"
      >
        Really delete both cards?
      </button>
    );
  }

  return (
    <button
      type="button"
      data-testid="browse-card-delete"
      onClick={() => setAsking(true)}
      className="self-start text-sm text-ink-muted underline"
    >
      Delete
    </button>
  );
}
