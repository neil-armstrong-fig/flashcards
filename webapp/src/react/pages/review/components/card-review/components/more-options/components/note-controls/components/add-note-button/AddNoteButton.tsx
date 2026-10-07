interface Props {
  readonly onAdd: () => void;
}

/** Offers to write a note on the card. */
export function AddNoteButton({onAdd}: Props): React.JSX.Element {
  return (
    <button
      type="button"
      data-testid="note-add"
      onClick={onAdd}
      className="flex min-h-12 w-full items-center justify-center rounded-xl bg-ground px-4 py-3"
    >
      Add a note
    </button>
  );
}
