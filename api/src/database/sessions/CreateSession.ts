import {database} from "@src/database/Database";
import {sessions} from "@src/database/schema/Sessions";
import type {NewSession} from "@src/database/types/NewSession";

export async function createSession(session: NewSession): Promise<void> {
  await database.insert(sessions).values(session);
}
