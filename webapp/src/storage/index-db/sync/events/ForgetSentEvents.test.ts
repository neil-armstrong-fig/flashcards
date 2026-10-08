import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";

vi.unmock("@src/storage/index-db/study/SaveCard");

beforeEach(() => {
  freshIndexedDb();
});

const SENT: CardEvent = {cardId: "c1", kind: "suspend", at: "2026-10-05T10:00:00.000Z"};
const WAITING: CardEvent = {cardId: "c2", kind: "suspend", at: "2026-10-05T10:05:00.000Z"};

it("takes only the sent events off the list to send", async () => {
  const {saveCard} = await import("@src/storage/index-db/study/SaveCard");
  const {forgetSentEvents} = await import("@src/storage/index-db/sync/events/ForgetSentEvents");
  const {readUnsentEvents} = await import("@src/storage/index-db/sync/events/ReadUnsentEvents");

  await saveCard({id: "c1", state: newCardState()}, SENT);
  await saveCard({id: "c2", state: newCardState()}, WAITING);
  await forgetSentEvents([SENT]);

  expect(await readUnsentEvents(10)).toEqual([WAITING]);
});
