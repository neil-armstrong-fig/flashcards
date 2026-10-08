import {freshIndexedDb} from "@src/testing/environment/browser/FreshIndexedDb";
import {newCardState} from "@src/spaced-repetition/card/NewCardState";

vi.unmock("@src/storage/clear-all/ClearAllStoredData");
vi.unmock("@src/storage/index-db/study/LoadStoredStudy");
vi.unmock("@src/storage/index-db/study/RecordAnswer");

beforeEach(() => {
  freshIndexedDb();
});

it("leaves a device that holds no progress, no settings and no databases", async () => {
  const {recordAnswer} = await import("@src/storage/index-db/study/RecordAnswer");
  const {loadStoredStudy} = await import("@src/storage/index-db/study/LoadStoredStudy");
  const {clearAllStoredData} = await import("@src/storage/clear-all/ClearAllStoredData");
  const card = {
    id: "ko-water-forward",
    state: newCardState({phase: "learning", reps: 1, due: "2026-01-01T10:10:00.000Z"}),
  };

  await recordAnswer(
    card,
    {
      cardId: card.id,
      rating: "good",
      phaseBefore: "new",
      reviewedAt: "2026-01-01T10:00:00.000Z",
      scheduledDays: 0,
      due: card.state.due,
    },
    [],
  );
  localStorage.setItem("flashcards.settings.v1", "{}");
  expect(Object.keys((await loadStoredStudy()).cards)).toEqual([card.id]);

  await clearAllStoredData();

  expect(localStorage.getItem("flashcards.settings.v1")).toBeNull();
  expect(await indexedDB.databases()).toEqual([]);
  expect((await loadStoredStudy()).cards).toEqual({});
});
