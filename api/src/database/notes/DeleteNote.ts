import {and, eq} from "drizzle-orm";
import {similarWords} from "@src/database/schema/SimilarWords";
import {database} from "@src/database/Database";
import {notes} from "@src/database/schema/Notes";

/**
 * Removes a card for this account, and the similar words kept with it, in one batch so neither is left behind. Removing one
 * that is not there does nothing, so it is safe to repeat.
 */
export async function deleteNote(userId: string, id: string): Promise<void> {
  await database.batch([
    database.delete(similarWords).where(and(eq(similarWords.userId, userId), eq(similarWords.noteId, id))),
    database.delete(notes).where(and(eq(notes.userId, userId), eq(notes.id, id))),
  ]);
}
