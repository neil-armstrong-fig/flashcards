import {database} from "@src/database/Database";
import {notes} from "@src/database/schema/Notes";
import type {NewNote} from "@src/database/types/NewNote";

/** Keeps a card. Asking for one that is already there does nothing, so it is safe to repeat. */
export async function saveNote({userId, id, word, meaning, romanisation, now}: NewNote): Promise<void> {
  await database.insert(notes).values({userId, id, word, meaning, romanisation, addedAt: now}).onConflictDoNothing();
}
