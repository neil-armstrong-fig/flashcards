import {similarWords} from "@src/database/schema/SimilarWords";
import {database} from "@src/database/Database";
import type {NewSimilarWord} from "@src/database/types/NewSimilarWord";

/** Keeps a word with a note. Asking for a word that is already there does nothing, so it is safe to repeat. */
export async function saveSimilarWord({userId, noteId, text, now}: NewSimilarWord): Promise<void> {
  await database.insert(similarWords).values({userId, noteId, text, addedAt: now}).onConflictDoNothing();
}
