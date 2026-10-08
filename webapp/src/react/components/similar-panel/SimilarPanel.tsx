import {buzz} from "@src/haptics/Buzz";
import {selectSignedIn} from "@src/redux/slices/account/selectors/SelectSignedIn";
import {SpeedSwitch} from "@src/react/components/speed-switch/SpeedSwitch";
import {VoiceSwitch} from "@src/react/components/voice-switch/VoiceSwitch";
import {useMemo, useState} from "react";
import {addSimilarWithRecordings} from "@src/react/audio/own-words/AddSimilarWithRecordings";
import {similarOf} from "@src/redux/slices/similar/similars/SimilarOf";
import {selectNoteById} from "@src/redux/slices/deck/selectors/SelectNoteById";
import {removeSimilarWord} from "@src/redux/slices/similar/actions/similar-word/thunks/RemoveSimilarWord";
import {SpeakerIcon} from "@src/react/components/speaker-icon/SpeakerIcon";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import {useAudioChoices} from "@src/react/audio/hooks/use-audio-choices/UseAudioChoices";
import {useSpeakSimilar} from "@src/react/audio/hooks/use-speak-similar/UseSpeakSimilar";

interface Props {
  /** The word whose similars these are: a word's two cards share them, so it is the word and not the card. */
  readonly noteId: string;
}

/**
 * For hearing a Korean word beside the ones it is mistaken for (물 and 불), one after the other or one at a time, in the voice and
 * speed chosen. The words that ship with it are there already and stay; the learner can ask for more, which are fetched once and
 * kept with the word for good (so they work offline) and can be deleted again. Used on a card and in the list of every card.
 */
export function SimilarPanel({noteId}: Props): React.JSX.Element | undefined {
  const dispatch = useAppDispatch();
  const learned = useAppSelector(state => state.similar.words[noteId]);
  const note = useAppSelector(state => selectNoteById(state, noteId));
  const similar = useMemo(() => similarOf(note, learned), [note, learned]);
  const signedIn = useAppSelector(selectSignedIn);
  const adding = useAppSelector(state => state.similar.adding);
  const error = useAppSelector(state => state.similar.error);
  const [text, setText] = useState("");
  const choices = useAudioChoices();
  const speakSimilar = useSpeakSimilar();

  if (!similar || !note || note.language === "music") {
    return undefined;
  }

  const {language} = note;
  const canAsk = signedIn && language === "ko";

  function hear(texts: readonly string[]): void {
    buzz();
    speakSimilar(texts, language, choices);
  }

  async function add(): Promise<void> {
    if (await addSimilarWithRecordings(dispatch, noteId, text)) {
      setText("");
    }
  }

  return (
    <section data-testid="similar-panel" className="flex w-full flex-col gap-3 rounded-xl bg-ground-raised p-4">
      <p className="text-sm text-ink-muted">Tap a word to hear it, or a pair to hear them one after the other.</p>

      <button
        type="button"
        data-testid="similar-play-own"
        onClick={() => hear([similar.own])}
        aria-label={`Play ${similar.own}`}
        className="flex items-center gap-3 rounded-lg bg-ground px-4 py-3 text-left text-lg"
      >
        <SpeakerIcon className="size-6 shrink-0 text-accent" />

        {similar.own}
      </button>

      <div className="flex gap-2 text-sm">
        <VoiceSwitch
          testId="similar-switch-voice"
          replay={replayChoices => speakSimilar([similar.own], language, replayChoices)}
          className="flex-1 rounded-full bg-ground px-3 py-2"
        />

        <SpeedSwitch
          testId="similar-switch-speed"
          replay={replayChoices => speakSimilar([similar.own], language, replayChoices)}
          className="flex-1 rounded-full bg-ground px-3 py-2"
        />
      </div>

      {similar.words.map(word => (
        <div key={word} data-testid="similar-row" className="flex items-center gap-2">
          <button
            type="button"
            data-testid="similar-play"
            aria-label={`Play ${word}`}
            onClick={() => hear([word])}
            className="flex flex-1 items-center gap-3 rounded-lg bg-ground px-4 py-3 text-left text-lg"
          >
            <SpeakerIcon className="size-6 shrink-0 text-accent" />

            <span data-testid="similar-word">{word}</span>
          </button>

          <button
            type="button"
            data-testid="similar-play-both"
            aria-label={`Play ${similar.own}, then ${word}`}
            onClick={() => hear([similar.own, word])}
            className="flex items-center gap-2 rounded-lg bg-ground px-4 py-3 text-sm"
          >
            <SpeakerIcon className="size-5 shrink-0 text-accent" />
            {similar.own} then {word}
          </button>

          {signedIn && similar.learned.includes(word) && (
            <button
              type="button"
              data-testid="similar-delete"
              aria-label={`Delete ${word}`}
              onClick={() => void dispatch(removeSimilarWord(noteId, word))}
              className="rounded-lg bg-ground px-3 py-3 text-sm text-ink-muted"
            >
              Delete
            </button>
          )}
        </div>
      ))}

      {canAsk && (
        <form
          className="flex gap-2"
          onSubmit={event => {
            event.preventDefault();
            void add();
          }}
        >
          <input
            data-testid="similar-input"
            lang="ko"
            value={text}
            placeholder="A word it sounds like"
            onChange={event => setText(event.currentTarget.value)}
            className="min-w-0 flex-1 rounded-lg bg-ground px-3 py-2"
          />

          <button
            type="submit"
            data-testid="similar-add"
            disabled={adding}
            className="rounded-lg bg-accent px-4 py-2 font-semibold text-ground"
          >
            Add
          </button>
        </form>
      )}

      {!signedIn && language === "ko" && (
        <p className="text-sm text-ink-muted">Asking for a word of your own needs a connection to sign-in.</p>
      )}

      {signedIn && error && (
        <p data-testid="similar-error" role="alert" className="text-sm text-ink-muted">
          {error}
        </p>
      )}
    </section>
  );
}
