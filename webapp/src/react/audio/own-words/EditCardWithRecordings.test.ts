import {addCardWithRecordings} from "@src/react/audio/own-words/AddCardWithRecordings";
import {editCardWithRecordings} from "@src/react/audio/own-words/EditCardWithRecordings";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {selectCards} from "@src/redux/slices/deck/selectors/SelectCards";
import {selectKeptTexts} from "@src/redux/shared/kept-texts/SelectKeptTexts";
import {signedIn} from "@src/redux/slices/account/AccountSlice";
import type {OpenedStudyStore} from "@src/testing/OpenedStudyStore";

const ELEPHANT = {word: "코끼리", meaning: "elephant", romanisation: "kokkiri"};
const WHALE = {word: "고래", meaning: "whale", romanisation: "gorae"};
const ID = "ko-custom-test-1";

async function storeWithAnElephant(): Promise<OpenedStudyStore> {
  const opened = await openedStudyStore();

  opened.store.dispatch(signedIn("me@example.com"));
  await addCardWithRecordings(opened.store.dispatch, ELEPHANT);

  return opened;
}

it("changes the words online and here, keeping the id and so both cards", async () => {
  const {store, accountApi} = await storeWithAnElephant();

  expect(await editCardWithRecordings(store.dispatch, ID, WHALE)).toBe(true);

  expect(accountApi.notes).toEqual([{id: ID, ...WHALE}]);
  expect(store.getState().deck.notes).toEqual([{id: ID, language: "ko", ...WHALE}]);
  expect(selectCards(store.getState()).map(card => card.id)).toContain(`${ID}/to-english`);
  expect(store.getState().study.cardOrder.filter(id => id.startsWith(ID))).toEqual([
    `${ID}/to-english`,
    `${ID}/from-english`,
  ]);
});

it("keeps the progress made on the card, because it is the same card", async () => {
  const {store} = await storeWithAnElephant();
  const before = store.getState().study.cards[`${ID}/to-english`];

  await editCardWithRecordings(store.dispatch, ID, WHALE);

  expect(store.getState().study.cards[`${ID}/to-english`]).toBe(before);
});

it("keeps the recordings of the new words before it saves, and lists them as kept so they can be played", async () => {
  const {store, keptAudio} = await storeWithAnElephant();

  await editCardWithRecordings(store.dispatch, ID, WHALE);

  expect(keptAudio.kept).toEqual(["코끼리", "elephant", "고래", "whale"]);
  expect(selectKeptTexts(store.getState())).toEqual([
    {language: "ko", text: "고래"},
    {language: "en", text: "whale"},
  ]);
});

it("fetches only the recordings of what changed", async () => {
  const {store, keptAudio} = await storeWithAnElephant();

  const keep = vi.spyOn(keptAudio, "keep");

  await editCardWithRecordings(store.dispatch, ID, {...ELEPHANT, romanisation: "kkokkiri"});

  expect(keep).not.toHaveBeenCalled();
});

it("allows a card to keep its own word", async () => {
  const {store} = await storeWithAnElephant();

  expect(await editCardWithRecordings(store.dispatch, ID, {...ELEPHANT, meaning: "tusker"})).toBe(true);
  expect(store.getState().deck.notes[0]?.meaning).toBe("tusker");
});

it("needs someone signed in, and a card of the learner's own", async () => {
  const {store, accountApi} = await storeWithAnElephant();

  expect(await editCardWithRecordings(store.dispatch, "ko-vocab-water", WHALE)).toBe(false);
  expect(await editCardWithRecordings(store.dispatch, "ko-custom-nothing", WHALE)).toBe(false);
  expect(accountApi.notes).toEqual([{id: ID, ...ELEPHANT}]);
});

it.each([
  ["a word that is not Korean", {...WHALE, word: "whale"}],
  ["no meaning", {...WHALE, meaning: ""}],
  ["a romanisation that is not Latin letters", {...WHALE, romanisation: "고래"}],
])("refuses %s with a reason, and changes nothing", async (_name, words) => {
  const {store, keptAudio, accountApi} = await storeWithAnElephant();

  expect(await editCardWithRecordings(store.dispatch, ID, words)).toBe(false);
  expect(store.getState().deck.editError).toBeDefined();
  expect(store.getState().deck.error).toBeUndefined();
  expect(keptAudio.kept).toEqual(["코끼리", "elephant"]);
  expect(accountApi.notes).toEqual([{id: ID, ...ELEPHANT}]);
});

it("refuses the word of another card, the deck's or the learner's", async () => {
  const {store, accountApi} = await storeWithAnElephant();

  expect(await editCardWithRecordings(store.dispatch, ID, {...WHALE, word: "물"})).toBe(false);
  expect(store.getState().deck.editError).toBe("That word is already here.");
  expect(accountApi.notes).toEqual([{id: ID, ...ELEPHANT}]);
});

it("changes nothing when a recording could not be had, or it could not be kept online", async () => {
  const {store, keptAudio, accountApi} = await storeWithAnElephant();
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  keptAudio.failing = true;
  expect(await editCardWithRecordings(store.dispatch, ID, WHALE)).toBe(false);
  keptAudio.failing = false;
  accountApi.unreachable = true;
  expect(await editCardWithRecordings(store.dispatch, ID, WHALE)).toBe(false);

  expect(store.getState().deck.notes).toEqual([{id: ID, language: "ko", ...ELEPHANT}]);
  expect(store.getState().deck.adding).toBe(false);
  expect(store.getState().deck.editError).toBeDefined();
});
