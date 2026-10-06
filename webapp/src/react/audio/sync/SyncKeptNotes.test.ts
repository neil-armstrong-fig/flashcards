import {SHIPPED_CARD_COUNT} from "@src/testing/ShippedCardCount";
import {noteAdded} from "@src/redux/slices/deck/DeckSlice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {syncKeptNotes} from "@src/react/audio/sync/SyncKeptNotes";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import type {KeptNote} from "@src/redux/slices/account/types/KeptNote";

const ELEPHANT: KeptNote = {id: "ko-custom-a", word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};
const GIRAFFE: KeptNote = {id: "ko-custom-b", word: "기린", meaning: "giraffe", romanisation: "girin"};

it("brings down the cards kept online, with their recordings and both directions", async () => {
  const {store, accountApi, keptAudio} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  accountApi.notes = [ELEPHANT, GIRAFFE];

  await syncKeptNotes(store);

  expect(store.getState().deck.notes.map(note => note.word)).toEqual(["코끼리", "기린"]);
  expect(keptAudio.kept).toEqual(["코끼리", "elephant", "기린", "giraffe"]);
  expect(store.getState().study.cardOrder.slice(SHIPPED_CARD_COUNT)).toEqual([
    "ko-custom-a/to-english",
    "ko-custom-a/from-english",
    "ko-custom-b/to-english",
    "ko-custom-b/from-english",
  ]);
});

it("drops a card here that the API no longer has, because the API is the truth", async () => {
  const {store, accountApi} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  store.dispatch(noteAdded({...ELEPHANT, language: "ko"}));
  accountApi.notes = [GIRAFFE];

  await syncKeptNotes(store);

  expect(store.getState().deck.notes.map(note => note.id)).toEqual(["ko-custom-b"]);
  expect(store.getState().study.cardOrder).not.toContain("ko-custom-a/to-english");
});

it("fetches a kept card's recordings again when this device has lost them, and adds nothing twice", async () => {
  const {store, accountApi, keptAudio} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  store.dispatch(noteAdded({...ELEPHANT, language: "ko"}));
  accountApi.notes = [ELEPHANT];

  await syncKeptNotes(store);

  expect(keptAudio.kept).toEqual(["코끼리", "elephant"]);
  expect(store.getState().deck.notes).toHaveLength(1);
});

it("skips a card whose recordings could not be had, and tries it again next time", async () => {
  const {store, accountApi, keptAudio} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  accountApi.notes = [ELEPHANT];
  keptAudio.failing = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  await syncKeptNotes(store);

  expect(store.getState().deck.notes).toEqual([]);
});

it("changes nothing when the API cannot be reached", async () => {
  const {store, accountApi} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  store.dispatch(noteAdded({...ELEPHANT, language: "ko"}));
  accountApi.unreachable = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  await syncKeptNotes(store);

  expect(store.getState().deck.notes).toHaveLength(1);
});

it("takes the words changed online, on another device, keeping the card and fetching what is new", async () => {
  const {store, accountApi, keptAudio} = await openedStudyStore();
  store.dispatch(signedIn("me@example.com"));
  await syncKeptNotes(store);
  accountApi.notes = [ELEPHANT];
  await syncKeptNotes(store);
  const before = store.getState().study.cards["ko-custom-a/to-english"];
  accountApi.notes = [{...ELEPHANT, word: "고래", meaning: "whale", romanisation: "gorae"}];

  await syncKeptNotes(store);

  expect(store.getState().deck.notes).toEqual([
    {id: "ko-custom-a", language: "ko", word: "고래", meaning: "whale", romanisation: "gorae"},
  ]);
  expect(keptAudio.kept).toEqual(["코끼리", "elephant", "고래", "whale"]);
  expect(store.getState().study.cards["ko-custom-a/to-english"]).toBe(before);
  expect(store.getState().study.cardOrder.filter(id => id.startsWith("ko-custom-a"))).toHaveLength(2);
});
