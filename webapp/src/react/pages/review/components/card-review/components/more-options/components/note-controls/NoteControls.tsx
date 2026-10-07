import {useState} from "react";
import {AddNoteButton} from "@src/react/pages/review/components/card-review/components/more-options/components/note-controls/components/add-note-button/AddNoteButton";
import {NoteEditor} from "@src/react/pages/review/components/card-review/components/more-options/components/note-controls/components/note-editor/NoteEditor";
import {noteRemoved} from "@src/redux/slices/card-notes/CardNotesSlice";
import {selectCurrentCardNote} from "@src/redux/slices/card-notes/selectors/SelectCardNote";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** Lets the learner write, or take off, their own memory aid for the card on screen. The note itself is shown on the card. */
export function NoteControls(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const cardId = useAppSelector(state => state.study.session?.currentCardId);
  const hasNote = useAppSelector(state => selectCurrentCardNote(state) !== undefined);
  const [editing, setEditing] = useState(false);

  if (cardId === undefined) {
    return <></>;
  }

  if (editing) {
    return <NoteEditor onDone={() => setEditing(false)} />;
  }

  if (hasNote) {
    return (
      <button
        type="button"
        data-testid="note-remove"
        onClick={() => dispatch(noteRemoved(cardId))}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-ground px-4 py-3"
      >
        Remove note
      </button>
    );
  }

  return <AddNoteButton onAdd={() => setEditing(true)} />;
}
