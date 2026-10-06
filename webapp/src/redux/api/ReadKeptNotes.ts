import {apiRequest} from "@src/redux/api/ApiRequest";
import {okJson} from "@src/redux/api/OkJson";
import {readCustomNote} from "@src/redux/slices/deck/storage/ReadCustomNote";
import type {KeptNote} from "@src/redux/slices/account/types/KeptNote";

/** The cards the learner made, oldest first. Each is checked before it is believed, and one that does not check out is left out. */
export async function readKeptNotes(): Promise<readonly KeptNote[]> {
  const body: unknown = await okJson(await apiRequest("/api/notes"));
  const notes: unknown = typeof body === "object" && body !== null ? Reflect.get(body, "notes") : undefined;

  if (!Array.isArray(notes)) {
    throw new Error("The API did not give the kept cards in a form that can be read.");
  }

  return notes.flatMap((value: unknown) => {
    const note = readCustomNote(value);

    if (!note) {
      return [];
    }

    return [{id: note.id, word: note.word, meaning: note.meaning, romanisation: note.romanisation}];
  });
}
