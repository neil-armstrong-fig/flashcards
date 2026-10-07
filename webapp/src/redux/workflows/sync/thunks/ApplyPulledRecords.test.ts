import {memoryNoteRecord} from "@src/redux/shared/sync-records/builders/MemoryNoteRecord";
import {noteRecord} from "@src/redux/shared/sync-records/builders/NoteRecord";
import {pictureRecord} from "@src/redux/shared/sync-records/builders/PictureRecord";
import {removalRecord} from "@src/redux/shared/sync-records/builders/RemovalRecord";
import {similarRecord} from "@src/redux/shared/sync-records/builders/SimilarRecord";
import {addedCustomNote} from "@src/testing/AddedCustomNote";
import {addedSimilarWord} from "@src/testing/AddedSimilarWord";
import {applyPulledRecords} from "@src/redux/workflows/sync/thunks/ApplyPulledRecords";
import {noteWritten} from "@src/redux/slices/card-notes/CardNotesSlice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import {SHIPPED_CARD_COUNT} from "@src/testing/ShippedCardCount";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};
const ID = "ko-custom-from-the-laptop";
const EARLY = "2026-10-05T08:00:00.000Z";
const LATE = "2026-10-06T08:00:00.000Z";
const HASH = "a".repeat(64);

const NOTE = noteRecord({id: ID, ...ELEPHANT, at: LATE});
const BALL = similarRecord({noteId: "ko-vocab-water", text: "볼", at: LATE});

async function signedInStore(): Promise<OpenedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));

  return opened;
}

it("adds a card another device made, studied both ways, and records nothing to send", async () => {
  const {store, records} = await signedInStore();

  await store.dispatch(applyPulledRecords([NOTE]));

  expect(store.getState().deck.notes).toEqual([{id: ID, language: "ko", ...ELEPHANT}]);
  expect(store.getState().study.cardOrder.slice(SHIPPED_CARD_COUNT)).toEqual([
    `${ID}/to-english`,
    `${ID}/from-english`,
  ]);
  expect(records.kept).toEqual([]);
  expect(records.known.get(`note|${ID}`)).toEqual(NOTE);
});

it("changes a card whose words another device changed, keeping its progress", async () => {
  const {store} = await signedInStore();

  await store.dispatch(applyPulledRecords([NOTE]));
  const before = store.getState().study.cards[`${ID}/to-english`];
  await store.dispatch(
    applyPulledRecords([{...NOTE, at: "2026-10-07T08:00:00.000Z", payload: {...ELEPHANT, meaning: "tusker"}}]),
  );

  expect(store.getState().deck.notes[0]?.meaning).toBe("tusker");
  expect(store.getState().study.cards[`${ID}/to-english`]).toBe(before);
});

it("takes a card another device deleted out, with its similars, notes and pictures, and records nothing to send", async () => {
  const {store, records, pictures} = await signedInStore();

  await addedCustomNote(store, ELEPHANT);
  const made = store.getState().deck.notes[0]?.id ?? "";
  await addedSimilarWord(store, made, "고기리");
  store.dispatch(noteWritten({cardId: `${made}/to-english`, text: "grey", addedAt: EARLY}));
  pictures.kept.set(`${made}/from-english`, EARLY);
  const before = records.kept.length;

  await store.dispatch(applyPulledRecords([removalRecord({kind: "note", id: made, at: LATE})]));

  expect(store.getState().deck.notes).toEqual([]);
  expect(store.getState().similar.words[made]).toBeUndefined();
  expect(store.getState().cardNotes.byCard).toEqual({});
  expect(store.getState().study.cardOrder).toHaveLength(SHIPPED_CARD_COUNT);
  expect(records.kept).toHaveLength(before);
});

it("ignores a change earlier than the latest this device knows of, so a change made here after another device's wins", async () => {
  const {store} = await signedInStore();

  await addedCustomNote(store, ELEPHANT);
  const made = store.getState().deck.notes[0]?.id ?? "";

  await store.dispatch(applyPulledRecords([removalRecord({kind: "note", id: made, at: EARLY})]));

  expect(store.getState().deck.notes).toHaveLength(1);
});

it("changes nothing when the learner's own change comes back from the API", async () => {
  const {store, records} = await signedInStore();

  await addedCustomNote(store, ELEPHANT);
  const mine = records.kept[0];

  await store.dispatch(applyPulledRecords(mine ? [mine] : []));

  expect(store.getState().deck.notes).toHaveLength(1);
  expect(store.getState().study.cardOrder).toHaveLength(SHIPPED_CARD_COUNT + 2);
  expect(records.kept).toHaveLength(1);
});

it("puts a device right that has lost what the screen showed but kept what it had heard, by taking the same changes again", async () => {
  const {store} = await signedInStore();

  await store.dispatch(applyPulledRecords([NOTE]));
  store.dispatch({type: "deck/noteRemoved", payload: ID});
  await store.dispatch(applyPulledRecords([NOTE]));

  expect(store.getState().deck.notes).toHaveLength(1);
});

it("adds a similar word another device added, once, and removes one it removed", async () => {
  const {store} = await signedInStore();

  await store.dispatch(applyPulledRecords([BALL]));
  await store.dispatch(applyPulledRecords([{...BALL, at: "2026-10-06T09:00:00.000Z"}]));

  expect(store.getState().similar.words["ko-vocab-water"]).toEqual(["볼"]);

  await store.dispatch(
    applyPulledRecords([removalRecord({kind: "similar", id: BALL.id, at: "2026-10-07T08:00:00.000Z"})]),
  );

  expect(store.getState().similar.words["ko-vocab-water"]).toEqual([]);
});

it("writes a note another device wrote on a card, dated as it was there, and takes one it removed off", async () => {
  const {store} = await signedInStore();
  const card = "ko-vocab-water/to-english";

  await store.dispatch(applyPulledRecords([memoryNoteRecord({cardId: card, text: "wet", at: LATE})]));

  expect(store.getState().cardNotes).toMatchObject({byCard: {[card]: "wet"}, addedAt: {[card]: LATE}});

  await store.dispatch(
    applyPulledRecords([removalRecord({kind: "memory-note", id: card, at: "2026-10-07T08:00:00.000Z"})]),
  );

  expect(store.getState().cardNotes.byCard).toEqual({});
});

it("fetches a picture another device put on a card by its hash, keeps it, and takes one it removed off", async () => {
  const {store, records, pictures} = await signedInStore();
  const card = "ko-vocab-water/to-english";
  const picture = new Blob(["a mule"], {type: "image/webp"});

  records.online.set(HASH, picture);
  await store.dispatch(applyPulledRecords([pictureRecord({cardId: card, hash: HASH, type: "image/webp", at: LATE})]));

  expect(pictures.blobs.get(card)).toBe(picture);
  expect(store.getState().cardPictures.byCard[card]).toBeDefined();
  expect(store.getState().cardPictures.addedAt[card]).toBe(LATE);

  await store.dispatch(
    applyPulledRecords([removalRecord({kind: "picture", id: card, at: "2026-10-07T08:00:00.000Z"})]),
  );

  expect(pictures.kept.has(card)).toBe(false);
  expect(store.getState().cardPictures.byCard[card]).toBeUndefined();
});

it("stops at a picture that cannot be fetched, leaving it and what follows to the next sync", async () => {
  const {store, records} = await signedInStore();

  records.downloadFails = true;
  await expect(
    store.dispatch(
      applyPulledRecords([
        pictureRecord({cardId: "ko-vocab-water/to-english", hash: HASH, type: "image/webp", at: LATE}),
        BALL,
      ]),
    ),
  ).rejects.toThrow();

  expect(store.getState().similar.words["ko-vocab-water"]).toBeUndefined();
  expect(records.known.size).toBe(0);
});
