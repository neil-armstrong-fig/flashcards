import {noteRequestFrom} from "@src/router/routes/notes/shared/utils/NoteRequestFrom";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import {updateNote} from "@src/database/notes/UpdateNote";
import type {Account} from "@src/database/types/Account";

/** `PUT /api/notes` with `{id, word, meaning, romanisation}`: changes the words of a card already kept. 404 if there is no such card. */
export async function changeNote(request: Request, account: Account): Promise<Response> {
  const note = noteRequestFrom(await request.json().catch(() => undefined));

  if (!note) {
    return respondEmpty(400);
  }
  if (!(await updateNote(account.id, note))) {
    return respondEmpty(404);
  }

  return respondEmpty(204);
}
