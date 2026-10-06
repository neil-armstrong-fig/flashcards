import {deleteNote} from "@src/database/notes/DeleteNote";
import {noteIdFrom} from "@src/router/routes/notes/shared/utils/NoteIdFrom";
import {respondEmpty} from "@src/router/respond/RespondEmpty";
import type {Account} from "@src/database/types/Account";

/** `DELETE /api/notes` with `{id}`: removes a card and the similar words kept with it. Removing one that is not there is fine. */
export async function removeNote(request: Request, account: Account): Promise<Response> {
  const id = noteIdFrom(await request.json().catch(() => undefined));

  if (id === undefined) {
    return respondEmpty(400);
  }

  await deleteNote(account.id, id);

  return respondEmpty(204);
}
