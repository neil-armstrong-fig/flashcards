import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {startSession} from "@src/redux/slices/study/actions/session/thunks/StartSession";
import {newCardsPerDayChosen} from "@src/redux/slices/settings/SettingsSlice";
import {selectCardsDueToday} from "@src/redux/slices/study/selectors/SelectCardsDueToday";
import {selectDeckCardsDueToday} from "@src/redux/slices/study/selectors/SelectDeckCardsDueToday";

it("studies one deck's cards only, so a session never mixes languages", async () => {
  const {store} = await openedStudyStore();

  store.dispatch(startSession("ja-hiragana"));

  expect(store.getState().study.session?.deckId).toBe("ja-hiragana");
  expect(store.getState().study.session?.currentCardId).toBe("ja-hiragana-a/to-english");
});

it("gives each deck its own daily limits, and counts them separately and together", async () => {
  const {store} = await openedStudyStore();

  store.dispatch(newCardsPerDayChosen({deckId: "ko-pronunciation", count: 0}));
  store.dispatch(newCardsPerDayChosen({deckId: "ko-sounds-alike", count: 0}));
  store.dispatch(newCardsPerDayChosen({deckId: "ja-hiragana", count: 5}));
  store.dispatch(newCardsPerDayChosen({deckId: "ja-katakana", count: 0}));
  store.dispatch(newCardsPerDayChosen({deckId: "ja-hiragana-combined", count: 0}));
  store.dispatch(newCardsPerDayChosen({deckId: "ja-katakana-combined", count: 0}));
  store.dispatch(newCardsPerDayChosen({deckId: "ja-katakana-foreign", count: 0}));

  expect(selectDeckCardsDueToday(store.getState(), "ko-starter")).toBe(20);
  expect(selectDeckCardsDueToday(store.getState(), "ja-hiragana")).toBe(5);
  expect(selectDeckCardsDueToday(store.getState(), "ja-katakana")).toBe(0);
  expect(selectCardsDueToday(store.getState())).toBe(25);
});
