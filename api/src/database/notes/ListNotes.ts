import {asc, eq} from "drizzle-orm";
import {database} from "@src/database/Database";
import {notes} from "@src/database/schema/Notes";
import type {Note} from "@src/database/types/Note";

/** Every card an account has made, oldest first. */
export async function listNotes(userId: string): Promise<Note[]> {
  return await database
    .select({id: notes.id, word: notes.word, meaning: notes.meaning, romanisation: notes.romanisation})
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(asc(notes.addedAt));
}
