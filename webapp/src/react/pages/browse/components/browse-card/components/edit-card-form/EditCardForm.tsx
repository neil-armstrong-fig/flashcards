import {useState} from "react";
import {CardWordsFields} from "@src/react/pages/browse/components/card-words-fields/CardWordsFields";
import {editCardWithRecordings} from "@src/react/audio/own-words/EditCardWithRecordings";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";

interface Props {
  readonly noteId: string;
  /** What the card says now, to start from. */
  readonly words: CardWords;
  /** Closes the form: after a save, or when the learner cancels. */
  readonly onClose: () => void;
}

/** Changes the words of a card the learner made. Saving keeps the card's progress, because it is the same card. */
export function EditCardForm({noteId, words: current, onClose}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const saving = useAppSelector(state => state.deck.adding);
  const error = useAppSelector(state => state.deck.editError);
  const [words, setWords] = useState(current);

  async function save(): Promise<void> {
    if (await editCardWithRecordings(dispatch, noteId, words)) {
      onClose();
    }
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={event => {
        event.preventDefault();
        void save();
      }}
    >
      <CardWordsFields testIdPrefix="edit-card" words={words} onChange={setWords} />

      <div className="flex gap-4">
        <button
          type="submit"
          data-testid="browse-card-edit-save"
          disabled={saving}
          className="rounded-lg bg-accent px-4 py-2 font-semibold text-ground"
        >
          Save
        </button>

        <button
          type="button"
          data-testid="browse-card-edit-cancel"
          onClick={onClose}
          className="text-sm text-ink-muted underline"
        >
          Cancel
        </button>
      </div>

      {error && (
        <p data-testid="edit-card-error" role="alert" className="text-sm text-ink-muted">
          {error}
        </p>
      )}
    </form>
  );
}
