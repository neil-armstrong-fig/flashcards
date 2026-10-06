import {selectSignedIn} from "@src/redux/slices/account/selectors/SelectSignedIn";
import {EditCardForm} from "@src/react/pages/browse/components/browse-card/components/edit-card-form/EditCardForm";
import {DeleteCardButton} from "@src/react/pages/browse/components/browse-card/components/delete-card-button/DeleteCardButton";
import {similarsToggled} from "@src/redux/slices/browse/BrowseSlice";
import {useState} from "react";
import {SimilarPanel} from "@src/react/components/similar-panel/SimilarPanel";
import {SpeakerIcon} from "@src/react/components/speaker-icon/SpeakerIcon";
import {statusLabelOf} from "@src/react/pages/browse/components/browse-card/status-label/StatusLabel";
import {selectIsStruggling} from "@src/redux/shared/struggling/SelectIsStruggling";
import {selectNoteById} from "@src/redux/slices/deck/selectors/SelectNoteById";
import {isCustomNoteId} from "@src/redux/slices/deck/ids/CustomNoteId";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import {useAudioChoices} from "@src/react/audio/hooks/use-audio-choices/UseAudioChoices";
import {useSpeakWord} from "@src/react/audio/hooks/use-speak-word/UseSpeakWord";
import type {BrowseRow} from "@src/redux/slices/browse/types/BrowseRow";

interface Props {
  readonly row: BrowseRow;
}

/** One card in the list: its two sides, how the Korean is said, where it is in its life, and a button to hear the Korean word. */
export function BrowseCard({row}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const choices = useAudioChoices();
  const speakWord = useSpeakWord();
  const signedIn = useAppSelector(selectSignedIn);
  const note = useAppSelector(state => selectNoteById(state, row.noteId));
  const struggling = useAppSelector(state => selectIsStruggling(state, row.id));
  const similarsOpen = useAppSelector(state => state.browse.similarsOpenFor === row.id);
  const [editing, setEditing] = useState(false);

  return (
    <li data-testid="browse-card" className="flex flex-col gap-3 rounded-xl bg-ground-raised p-4">
      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="flex items-baseline gap-3">
            <span data-testid="browse-card-front" className="text-2xl">
              {row.front}
            </span>

            <span aria-hidden="true" className="text-ink-muted">
              to
            </span>

            <span data-testid="browse-card-back" className="text-lg text-ink-muted">
              {row.back}
            </span>
          </p>

          <p className="flex gap-3 text-sm text-ink-muted">
            <span data-testid="browse-card-hint">{row.hint}</span>

            <span data-testid="browse-card-status">{statusLabelOf(row.status)}</span>

            {struggling && (
              <span data-testid="browse-card-struggling" className="text-accent">
                Struggling
              </span>
            )}
          </p>
        </div>

        <button
          type="button"
          data-testid="browse-card-play"
          aria-label={`Play ${row.korean}`}
          onClick={() => speakWord(row.korean, choices)}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ground text-accent"
        >
          <SpeakerIcon className="size-6" />
        </button>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          data-testid="browse-card-similars"
          aria-expanded={similarsOpen}
          onClick={() => dispatch(similarsToggled(row.id))}
          className="self-start text-sm text-ink-muted underline"
        >
          Similars
        </button>

        {signedIn && note && isCustomNoteId(row.noteId) && !editing && (
          <button
            type="button"
            data-testid="browse-card-edit"
            onClick={() => setEditing(true)}
            className="self-start text-sm text-ink-muted underline"
          >
            Edit
          </button>
        )}

        {signedIn && isCustomNoteId(row.noteId) && <DeleteCardButton noteId={row.noteId} />}
      </div>

      {editing && note && <EditCardForm noteId={row.noteId} words={note} onClose={() => setEditing(false)} />}

      {similarsOpen && <SimilarPanel noteId={row.noteId} />}
    </li>
  );
}
