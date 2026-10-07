import {TEST_NOW} from "@src/testing/time/TestNow";
import {SHIPPED_CARD_COUNT} from "@src/testing/ShippedCardCount";
import {addCardWithRecordings} from "@src/react/audio/own-words/AddCardWithRecordings";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectCards} from "@src/redux/slices/deck/selectors/SelectCards";
import {selectKeptTexts} from "@src/redux/shared/kept-texts/SelectKeptTexts";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};

async function signedInStore(): Promise<OpenedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));

  return opened;
}

it("keeps the Korean and the English, records the card to be sent online, and lists both of its directions as new", async () => {
  const {store, keptAudio, records} = await signedInStore();

  const added = await addCardWithRecordings(store.dispatch, ELEPHANT);

  expect(added).toBe(true);
  expect(keptAudio.kept).toEqual(["코끼리", "elephant"]);
  expect(records.kept).toEqual([
    {kind: "note", id: "ko-custom-test-1", at: TEST_NOW.toISOString(), deleted: false, payload: ELEPHANT},
  ]);
  expect(
    selectCards(store.getState())
      .slice(SHIPPED_CARD_COUNT)
      .map(card => card.id),
  ).toEqual(["ko-custom-test-1/to-english", "ko-custom-test-1/from-english"]);
  expect(store.getState().study.cardOrder.slice(SHIPPED_CARD_COUNT)).toEqual([
    "ko-custom-test-1/to-english",
    "ko-custom-test-1/from-english",
  ]);
  expect(store.getState().study.cards["ko-custom-test-1/to-english"]?.phase).toBe("new");
});

it("lists the Korean and the English as texts kept on this device, so they can be played", async () => {
  const {store} = await signedInStore();
  await addCardWithRecordings(store.dispatch, ELEPHANT);

  expect(selectKeptTexts(store.getState())).toEqual([
    {language: "ko", text: "코끼리"},
    {language: "en", text: "elephant"},
  ]);
});

it("trims what was typed", async () => {
  const {store, records} = await signedInStore();

  await addCardWithRecordings(store.dispatch, {word: " 코끼리 ", meaning: " elephant ", romanisation: " kokkiri "});

  expect(records.kept[0]?.payload).toEqual(ELEPHANT);
});

it("needs someone signed in", async () => {
  const {store, keptAudio, records} = await openedStudyStore();

  expect(await addCardWithRecordings(store.dispatch, ELEPHANT)).toBe(false);
  expect(keptAudio.kept).toEqual([]);
  expect(records.kept).toEqual([]);
  expect(store.getState().deck.notes).toEqual([]);
});

it.each([
  ["a word that is not Korean", {...ELEPHANT, word: "elephant"}],
  ["no meaning", {...ELEPHANT, meaning: ""}],
  ["a romanisation that is not Latin letters", {...ELEPHANT, romanisation: "코끼리"}],
])("refuses %s with a reason, and keeps nothing", async (_name, words) => {
  const {store, keptAudio, records} = await signedInStore();

  expect(await addCardWithRecordings(store.dispatch, words)).toBe(false);
  expect(store.getState().deck.error).toBeDefined();
  expect(keptAudio.kept).toEqual([]);
  expect(records.kept).toEqual([]);
  expect(store.getState().deck.notes).toEqual([]);
});

it("refuses a word the deck already has", async () => {
  const {store, records} = await signedInStore();

  expect(await addCardWithRecordings(store.dispatch, {word: "물", meaning: "water", romanisation: "mul"})).toBe(false);
  expect(store.getState().deck.error).toBe("That word is already here.");
  expect(records.kept).toEqual([]);
});

it("refuses a word the learner has already made a card of", async () => {
  const {store} = await signedInStore();
  await addCardWithRecordings(store.dispatch, ELEPHANT);

  expect(await addCardWithRecordings(store.dispatch, {...ELEPHANT, meaning: "tusker"})).toBe(false);
  expect(store.getState().deck.notes).toHaveLength(1);
});

it("adds nothing when a recording could not be had, so there is never a card that cannot be played", async () => {
  const {store, keptAudio, records} = await signedInStore();
  keptAudio.failing = true;
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  expect(await addCardWithRecordings(store.dispatch, ELEPHANT)).toBe(false);
  expect(store.getState().deck.error).toBeDefined();
  expect(store.getState().deck.adding).toBe(false);
  expect(store.getState().deck.notes).toEqual([]);
  expect(records.kept).toEqual([]);
});

it("adds the card even when the API cannot be reached, as it is sent when it can be", async () => {
  const {store, accountApi} = await signedInStore();
  accountApi.unreachable = true;

  expect(await addCardWithRecordings(store.dispatch, ELEPHANT)).toBe(true);
  expect(store.getState().study.cardOrder).toHaveLength(SHIPPED_CARD_COUNT + 2);
});
