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
      className="self-center text-sm text-ink-muted underline"
    >
      Add a note
    </button>
  );
}
