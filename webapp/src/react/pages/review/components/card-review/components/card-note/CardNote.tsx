import {useState} from "react";
import {AddNoteButton} from "@src/react/pages/review/components/card-review/components/card-note/components/add-note-button/AddNoteButton";
import {NoteEditor} from "@src/react/pages/review/components/card-review/components/card-note/components/note-editor/NoteEditor";
import {NoteText} from "@src/react/pages/review/components/card-review/components/card-note/components/note-text/NoteText";
import {selectCurrentCardNote} from "@src/redux/slices/card-notes/selectors/SelectCardNote";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** The learner's own memory aid for the card on screen: shows it, and lets them write, change or remove it. */
export function CardNote(): React.JSX.Element {
  const hasCard = useAppSelector(state => state.study.session?.currentCardId !== undefined);
  const hasNote = useAppSelector(state => selectCurrentCardNote(state) !== undefined);
  const [editing, setEditing] = useState(false);

  return (
    <>
      {hasCard && editing && <NoteEditor onDone={() => setEditing(false)} />}

      {hasCard && !editing && hasNote && <NoteText />}

      {hasCard && !editing && !hasNote && <AddNoteButton onAdd={() => setEditing(true)} />}
    </>
  );
}
