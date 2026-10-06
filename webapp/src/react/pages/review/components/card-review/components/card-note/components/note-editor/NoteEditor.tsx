import {useState} from "react";
import {MAXIMUM_NOTE_LENGTH} from "@src/redux/slices/card-notes/limits/MaximumNoteLength";
import {writeCardNote} from "@src/redux/slices/card-notes/actions/card-note/thunks/WriteCardNote";
import {useAppDispatch} from "@src/redux/shared/Hooks";

interface Props {
  /** Runs once the note is kept. */
  readonly onDone: () => void;
}

/** A box to write the note in, and the button that keeps it. The draft lives here until it is kept. */
export function NoteEditor({onDone}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <textarea
        data-testid="note-input"
        aria-label="Note for this card"
        value={draft}
        maxLength={MAXIMUM_NOTE_LENGTH}
        rows={3}
        onChange={event => setDraft(event.target.value)}
        className="rounded border border-ink-muted bg-ground p-2 text-sm"
      />

      <button
        type="button"
        data-testid="note-save"
        onClick={() => {
          dispatch(writeCardNote(draft));
          onDone();
        }}
        className="self-start text-sm underline"
      >
        Keep note
      </button>
    </div>
  );
}
