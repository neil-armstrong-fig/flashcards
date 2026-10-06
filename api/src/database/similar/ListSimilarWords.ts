import {asc, eq} from "drizzle-orm";
import {similarWords} from "@src/database/schema/SimilarWords";
import {database} from "@src/database/Database";
import type {SimilarWord} from "@src/database/types/SimilarWord";

/** Every similar word an account has asked for, oldest first, so a note's words keep the order they were added in. */
export async function listSimilarWords(userId: string): Promise<SimilarWord[]> {
  return await database
    .select({noteId: similarWords.noteId, text: similarWords.text})
    .from(similarWords)
    .where(eq(similarWords.userId, userId))
    .orderBy(asc(similarWords.addedAt));
}
