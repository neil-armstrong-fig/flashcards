import {isRecord} from "@src/json/IsRecord";

/** The longest a custom note's id may be: `ko-custom-` and a UUID is 46, so this is room and not a place for anything else. */
const MAX_NOTE_ID_LENGTH = 64;
const CUSTOM_NOTE_ID = /^ko-custom-[a-z0-9-]+$/;

/** A request body that is nothing but the id of a card the learner made, or `undefined` for anything else. */
export function noteIdFrom(body: unknown): string | undefined {
  if (!isRecord(body)) {
    return undefined;
  }

  const {id} = body;

  if (typeof id !== "string" || id.length > MAX_NOTE_ID_LENGTH || !CUSTOM_NOTE_ID.test(id)) {
    return undefined;
  }

  return id;
}
