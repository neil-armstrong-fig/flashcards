import {memoryNoteRecord} from "@src/redux/shared/sync-records/builders/MemoryNoteRecord";
import {noteRecord} from "@src/redux/shared/sync-records/builders/NoteRecord";
import {pictureRecord} from "@src/redux/shared/sync-records/builders/PictureRecord";
import {removalRecord} from "@src/redux/shared/sync-records/builders/RemovalRecord";
import {similarRecord} from "@src/redux/shared/sync-records/builders/SimilarRecord";
import {addedCustomNote} from "@src/testing/AddedCustomNote";
import {addedSimilarWord} from "@src/testing/AddedSimilarWord";
import {adoptLocalRecords} from "@src/redux/workflows/sync/thunks/AdoptLocalRecords";
import {noteWritten} from "@src/redux/slices/card-notes/CardNotesSlice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};
const NOTED_AT = "2026-09-01T10:00:00.000Z";
const THE_BEGINNING = "1970-01-01T00:00:00.000Z";

/** A device as it was before there was anything to sync: the learner's cards, similars, notes and pictures are held, and nothing is recorded of them. */
async function deviceFromBefore(): Promise<OpenedStudyStore> {
  const opened = await openedStudyStore();
  const {store, records, pictures} = opened;

  store.dispatch(signedIn("me@example.com"));
  await addedCustomNote(store, ELEPHANT);
  await addedSimilarWord(store, "ko-vocab-water", "볼");
  store.dispatch(noteWritten({cardId: "ko-vocab-water/to-english", text: "wet", addedAt: NOTED_AT}));
  await pictures.keep("ko-vocab-water/from-english", new Blob(["abc"], {type: "image/webp"}), NOTED_AT);
  store.dispatch({
    type: "cardPictures/pictureKept",
    payload: {cardId: "ko-vocab-water/from-english", address: "x", addedAt: NOTED_AT},
  });
  records.kept.length = 0;
  records.known.clear();

  return opened;
}

it("makes a record of everything the device holds, dated as it was where it has a date and as the beginning of time where it has none", async () => {
  const {store, records} = await deviceFromBefore();

  await store.dispatch(adoptLocalRecords());

  expect(records.kept).toEqual([
    noteRecord({id: "ko-custom-test-1", ...ELEPHANT, at: THE_BEGINNING}),
    similarRecord({noteId: "ko-vocab-water", text: "볼", at: THE_BEGINNING}),
    memoryNoteRecord({cardId: "ko-vocab-water/to-english", text: "wet", at: NOTED_AT}),
    pictureRecord({
      cardId: "ko-vocab-water/from-english",
      hash: "3".padStart(64, "0"),
      type: "image/webp",
      at: NOTED_AT,
    }),
  ]);
});

it("does it once, so what is changed or removed since is not made again", async () => {
  const {store, records} = await deviceFromBefore();

  await store.dispatch(adoptLocalRecords());
  records.kept.length = 0;
  await store.dispatch(adoptLocalRecords());

  expect(records.kept).toEqual([]);
});

it("leaves a thing that already has a record as that record says", async () => {
  const {store, records} = await deviceFromBefore();
  const removal = removalRecord({kind: "similar", id: "ko-vocab-water|볼", at: "2026-10-01T10:00:00.000Z"});

  await records.hear(removal);
  await store.dispatch(adoptLocalRecords());

  expect(records.known.get("similar|ko-vocab-water|볼")).toEqual(removal);
  expect(records.summary()).not.toContain("similar ko-vocab-water|볼 kept");
});
