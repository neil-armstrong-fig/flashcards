import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";
import {reviewCard} from "@src/spaced-repetition/scheduling/ReviewCard";

vi.unmock("@src/storage/index-db/study/LoadStoredStudy");
vi.unmock("@src/storage/index-db/study/RecordAnswer");

beforeEach(() => {
  freshIndexedDb();
});

it("is empty on a device that has kept nothing", async () => {
  const {loadStoredStudy} = await import("@src/storage/index-db/study/LoadStoredStudy");

  expect(await loadStoredStudy()).toEqual({cards: {}, log: []});
});

it("gives back the cards and answers that were kept", async () => {
  const {loadStoredStudy} = await import("@src/storage/index-db/study/LoadStoredStudy");
  const {recordAnswer} = await import("@src/storage/index-db/study/RecordAnswer");
  const now = new Date("2026-10-05T10:00:00.000Z");
  const answered = reviewCard({
    card: {id: "c1", state: newCardState({due: now.toISOString()})},
    rating: "good",
    now,
    desiredRetention: 0.9,
  });

  await recordAnswer({id: "c1", state: answered.state}, answered.log, []);

  expect(await loadStoredStudy()).toEqual({cards: {c1: answered.state}, log: [answered.log]});
});
