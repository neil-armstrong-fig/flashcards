import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

vi.unmock("@src/storage/index-db/study/LoadStoredStudy");
vi.unmock("@src/storage/index-db/study/SaveCard");

beforeEach(() => {
  freshIndexedDb();
});

it("keeps the card as it now is and the event that did it, as one to send", async () => {
  const {saveCard} = await import("@src/storage/index-db/study/SaveCard");
  const {loadStoredStudy} = await import("@src/storage/index-db/study/LoadStoredStudy");
  const {readUnsentEvents} = await import("@src/storage/index-db/sync/events/ReadUnsentEvents");
  const state = newCardState({due: "2026-10-05T10:00:00.000Z"});
  const event: CardEvent = {cardId: "c1", kind: "suspend", at: "2026-10-05T10:00:00.000Z"};

  await saveCard({id: "c1", state}, event);

  expect(await loadStoredStudy()).toEqual({cards: {c1: state}, log: []});
  expect(await readUnsentEvents(10)).toEqual([event]);
});
