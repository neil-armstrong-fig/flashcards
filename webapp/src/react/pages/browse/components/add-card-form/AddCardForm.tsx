import {selectSignedIn} from "@src/redux/slices/account/selectors/SelectSignedIn";
import {useState} from "react";
import {CardWordsFields} from "@src/react/pages/browse/components/card-words-fields/CardWordsFields";
import {addCardWithRecordings} from "@src/react/audio/own-words/AddCardWithRecordings";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

const NO_WORDS = {word: "", meaning: "", romanisation: ""};

/** The form for a card of the learner's own: the Korean, what it means, and how it is said. Only for someone signed in. */
export function AddCardForm(): React.JSX.Element | undefined {
  const dispatch = useAppDispatch();
  const signedIn = useAppSelector(selectSignedIn);
  const adding = useAppSelector(state => state.deck.adding);
  const error = useAppSelector(state => state.deck.error);
  const [words, setWords] = useState(NO_WORDS);

  if (!signedIn) {
    return undefined;
  }

  async function add(): Promise<void> {
    if (await addCardWithRecordings(dispatch, words)) {
      setWords(NO_WORDS);
    }
  }

  return (
    <form
      className="flex flex-col gap-2 rounded-xl bg-ground-raised p-4"
      onSubmit={event => {
        event.preventDefault();
        void add();
      }}
    >
      <h2 className="font-semibold">Make a card</h2>

      <CardWordsFields testIdPrefix="new-card" words={words} onChange={setWords} />

      <button
        type="submit"
        data-testid="browse-add-card"
        disabled={adding}
        className="min-h-11 rounded-lg bg-accent px-4 py-2 font-semibold text-ground"
      >
        Add card
      </button>

      {error && (
        <p data-testid="new-card-error" role="alert" className="text-sm text-ink-muted">
          {error}
        </p>
      )}
    </form>
  );
}
