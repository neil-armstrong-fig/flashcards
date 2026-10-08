import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

vi.unmock("@src/storage/index-db/study/SaveCard");

beforeEach(() => {
  freshIndexedDb();
});

const FIRST: CardEvent = {cardId: "c1", kind: "suspend", at: "2026-10-05T10:00:00.000Z"};
const SECOND: CardEvent = {cardId: "c2", kind: "suspend", at: "2026-10-05T10:05:00.000Z"};

it("gives the events made here and not yet sent, no more than the limit", async () => {
  const {saveCard} = await import("@src/storage/index-db/study/SaveCard");
  const {readUnsentEvents} = await import("@src/storage/index-db/sync/events/ReadUnsentEvents");

  await saveCard({id: "c1", state: newCardState()}, FIRST);
  await saveCard({id: "c2", state: newCardState()}, SECOND);

  expect(await readUnsentEvents(10)).toEqual([FIRST, SECOND]);
  expect(await readUnsentEvents(1)).toEqual([FIRST]);
});
