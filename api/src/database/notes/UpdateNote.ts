import {and, eq} from "drizzle-orm";
import {database} from "@src/database/Database";
import {notes} from "@src/database/schema/Notes";
import type {Note} from "@src/database/types/Note";

/** Changes the words of a card this account has kept, leaving its id, its date and its similars alone. Says whether there was such a card. */
export async function updateNote(userId: string, {id, word, meaning, romanisation}: Note): Promise<boolean> {
  const changed = await database
    .update(notes)
    .set({word, meaning, romanisation})
    .where(and(eq(notes.userId, userId), eq(notes.id, id)))
    .returning({id: notes.id});

  return changed.length > 0;
}
