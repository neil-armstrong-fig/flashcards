import {useEffect, useRef} from "react";

interface Props {
  readonly open: boolean;
  /** What the dialog is for, said aloud by a screen reader. */
  readonly label: string;
  readonly testId: string;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
}

/**
 * A modal box over the screen, closed by Escape, a tap outside it, or whatever calls `onClose`. The browser makes the rest of the
 * page inert while it is open and returns focus to what opened it. Its content is only built while it is open, so a closed one holds nothing.
 */
export function Dialog({open, label, testId, onClose, children}: Props): React.JSX.Element {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      data-testid={testId}
      aria-label={label}
      onClose={onClose}
      onClick={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl bg-ground-raised p-4 text-ink backdrop:bg-black/60"
    >
      {open && children}
    </dialog>
  );
}
