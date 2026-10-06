import {noteRequestFrom} from "@src/router/routes/notes/shared/utils/NoteRequestFrom";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {saveNote} from "@src/database/notes/SaveNote";
import type {Account} from "@src/database/types/Account";

/** `POST /api/notes` with `{id, word, meaning, romanisation}`: keeps a card the learner made. Asking again for one already kept is fine. */
export async function addNote(request: Request, account: Account): Promise<Response> {
  const note = noteRequestFrom(await request.json().catch(() => undefined));

  if (!note) {
    return respondEmpty(400);
  }

  await saveNote({...note, userId: account.id, now: new Date()});

  return respondEmpty(204);
}
