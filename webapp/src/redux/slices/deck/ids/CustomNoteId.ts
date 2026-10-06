const PREFIX = "ko-custom-";

/** The id of a card the learner made, from a random token: stable for ever, like every note's id. */
export function customNoteIdOf(token: string): string {
  return `${PREFIX}${token}`;
}

/** Whether a note is one the learner made, as opposed to one that ships with a deck. */
export function isCustomNoteId(noteId: string): boolean {
  return noteId.startsWith(PREFIX);
}
