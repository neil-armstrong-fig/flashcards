import {and, eq} from "drizzle-orm";
import {similarWords} from "@src/database/schema/SimilarWords";
import {database} from "@src/database/Database";
import type {SimilarWord} from "@src/database/types/SimilarWord";

/** Removes a word from a note, for this account only. Removing one that is not there does nothing, so it is safe to repeat. */
export async function deleteSimilarWord(userId: string, {noteId, text}: SimilarWord): Promise<void> {
  await database
    .delete(similarWords)
    .where(and(eq(similarWords.userId, userId), eq(similarWords.noteId, noteId), eq(similarWords.text, text)));
}
