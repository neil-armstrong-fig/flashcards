import {useState} from "react";
import {romanisationOf} from "@language-learning/shared/language/RomanisationOf";
import type {CardWords} from "@src/redux/slices/deck/types/CardWords";

interface Props {
  /** Starts each field's test id (`new-card` gives `new-card-word`), so the add form and an edit form on the same page do not share ids. */
  readonly testIdPrefix: string;
  readonly words: CardWords;
  readonly onChange: (words: CardWords) => void;
}

/** The three fields of a card: the Korean, what it means, and how it is said, which is filled in from the Korean until the learner types over it. */
export function CardWordsFields({testIdPrefix, words, onChange}: Props): React.JSX.Element {
  // Once the learner has typed over how it is said, the suggestion stops following the word; clearing it hands it back.
  const [typed, setTyped] = useState(false);
  const typedOver = typed && words.romanisation !== "";

  function typeWord(word: string): void {
    if (typedOver) {
      onChange({...words, word});

      return;
    }

    onChange({...words, word, romanisation: romanisationOf(word) ?? ""});
  }

  function typeRomanisation(romanisation: string): void {
    onChange({...words, romanisation});
    setTyped(romanisation !== "");
  }

  return (
    <>
      <input
        data-testid={`${testIdPrefix}-word`}
        lang="ko"
        value={words.word}
        placeholder="The Korean word"
        aria-label="The Korean word"
        onChange={event => typeWord(event.currentTarget.value)}
        className="rounded-lg bg-ground px-3 py-2"
      />

      <input
        data-testid={`${testIdPrefix}-meaning`}
        value={words.meaning}
        placeholder="What it means in English"
        aria-label="What it means in English"
        onChange={event => onChange({...words, meaning: event.currentTarget.value})}
        className="rounded-lg bg-ground px-3 py-2"
      />

      <input
        data-testid={`${testIdPrefix}-romanisation`}
        value={words.romanisation}
        placeholder="How it is said, in Latin letters (filled in for you)"
        aria-label="How it is said, in Latin letters"
        onChange={event => typeRomanisation(event.currentTarget.value)}
        className="rounded-lg bg-ground px-3 py-2"
      />
    </>
  );
}
