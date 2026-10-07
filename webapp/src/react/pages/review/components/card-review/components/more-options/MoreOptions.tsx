import {useState} from "react";
import {Dialog} from "@src/react/components/dialog/Dialog";
import {HideTargetToggle} from "@src/react/pages/review/components/card-review/components/more-options/components/hide-target-toggle/HideTargetToggle";
import {MarkHardButton} from "@src/react/pages/review/components/card-review/components/mark-hard-button/MarkHardButton";
import {NoteControls} from "@src/react/pages/review/components/card-review/components/more-options/components/note-controls/NoteControls";
import {PictureControls} from "@src/react/pages/review/components/card-review/components/more-options/components/picture-controls/PictureControls";
import {SetAsideButtons} from "@src/react/pages/review/components/card-review/components/set-aside-buttons/SetAsideButtons";
import {useAppSelector} from "@src/redux/shared/Hooks";

/**
 * The actions a learner rarely wants (hiding the word, a picture, a note, hard, bury, suspend), behind one button so that none is tapped by accident
 * while walking. Setting a card aside moves on to another card, so it closes the dialog.
 */
export function MoreOptions(): React.JSX.Element {
  const currentCardId = useAppSelector(state => state.study.session?.currentCardId);
  const [openFor, setOpenFor] = useState<string | undefined>(undefined);
  const open = openFor !== undefined && openFor === currentCardId;

  function close(): void {
    setOpenFor(undefined);
  }

  return (
    <>
      <button
        type="button"
        data-testid="more-options"
        onClick={() => setOpenFor(currentCardId)}
        className="min-h-12 self-center px-6 py-3 text-ink-muted underline"
      >
        More
      </button>

      <Dialog open={open} label="More options for this card" testId="more-options-dialog" onClose={close}>
        <div className="flex flex-col gap-3">
          <HideTargetToggle />

          <PictureControls />

          <NoteControls />

          <MarkHardButton />

          <SetAsideButtons />

          <button
            type="button"
            data-testid="more-options-close"
            onClick={close}
            className="min-h-12 rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-ground"
          >
            Done
          </button>
        </div>
      </Dialog>
    </>
  );
}
