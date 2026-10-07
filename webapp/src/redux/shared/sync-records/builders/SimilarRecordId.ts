/** What names a similar word as a record: its card and the word, which together are the one thing, so adding it twice is one record. */
export function similarRecordId(noteId: string, text: string): string {
  return `${noteId}|${text}`;
}
