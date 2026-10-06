// @vitest-environment jsdom
import {act, renderHook} from "@testing-library/react";
import {answerCard} from "@src/redux/slices/study/actions/answering/thunks/AnswerCard";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {sessionEnded} from "@src/redux/slices/study/StudySlice";
import {setCardAside} from "@src/redux/slices/study/actions/setting-aside/thunks/SetCardAside";
import {showAnswer} from "@src/redux/slices/study/actions/answering/thunks/ShowAnswer";
import {deckSpeedChosen, deckVoiceChosen} from "@src/redux/slices/settings/SettingsSlice";
import {startSession} from "@src/redux/slices/study/actions/session/thunks/StartSession";
import {storeProviderOf} from "@src/testing/StoreProviderOf";
import {useCardAudio} from "@src/react/audio/hooks/use-card-audio/UseCardAudio";

const KOREAN_WATER = "audio/ko/male-normal/water.mp3";
const ENGLISH_WATER = "audio/en/female-normal/water.mp3";
const KOREAN_RICE = "audio/ko/male-normal/rice.mp3";

it("speaks the first card's Korean word when the review opens", async () => {
  const {store, audio} = await openedStudyStore();

  renderHook(() => useCardAudio(), {wrapper: storeProviderOf(store)});

  expect(audio.played).toEqual([KOREAN_WATER]);
});

it("speaks the English answer when the answer is shown", async () => {
  const {store, audio} = await openedStudyStore();
  renderHook(() => useCardAudio(), {wrapper: storeProviderOf(store)});

  act(() => {
    store.dispatch(showAnswer());
  });

  expect(audio.played).toEqual([KOREAN_WATER, ENGLISH_WATER]);
});

it("speaks the next card's Korean word once an answer is saved", async () => {
  const {store, audio} = await openedStudyStore();
  renderHook(() => useCardAudio(), {wrapper: storeProviderOf(store)});

  act(() => {
    store.dispatch(showAnswer());
  });
  await act(async () => {
    await store.dispatch(answerCard("easy"));
  });

  expect(audio.played).toEqual([KOREAN_WATER, ENGLISH_WATER, KOREAN_RICE]);
});

it("speaks the next card's Korean word when a card is set aside", async () => {
  const {store, audio} = await openedStudyStore();
  renderHook(() => useCardAudio(), {wrapper: storeProviderOf(store)});

  await act(async () => {
    await store.dispatch(setCardAside("bury"));
  });

  expect(audio.played).toEqual([KOREAN_WATER, KOREAN_RICE]);
});

it("speaks the next card's Korean word after the learner forgot a card", async () => {
  const {store, audio} = await openedStudyStore();
  renderHook(() => useCardAudio(), {wrapper: storeProviderOf(store)});

  act(() => {
    store.dispatch(showAnswer());
  });
  await act(async () => {
    await store.dispatch(answerCard("again"));
  });

  expect(audio.played).toEqual([KOREAN_WATER, ENGLISH_WATER, KOREAN_RICE]);
});

it("speaks in the voice and at the speed chosen", async () => {
  const {store, audio} = await openedStudyStore();
  store.dispatch(deckVoiceChosen({deckId: "ko-starter", voice: "female"}));
  store.dispatch(deckSpeedChosen({deckId: "ko-starter", speed: "slower"}));

  renderHook(() => useCardAudio(), {wrapper: storeProviderOf(store)});

  expect(audio.played).toEqual(["audio/ko/female-slower/water.mp3"]);
});

it("does not speak when the voice or speed is changed: the switch does that", async () => {
  const {store, audio} = await openedStudyStore();
  renderHook(() => useCardAudio(), {wrapper: storeProviderOf(store)});

  act(() => {
    store.dispatch(deckVoiceChosen({deckId: "ko-starter", voice: "female"}));
    store.dispatch(deckSpeedChosen({deckId: "ko-starter", speed: "slower"}));
  });

  expect(audio.played).toEqual([KOREAN_WATER]);
});

it("speaks once, not twice, when StrictMode runs the effect again on mount", async () => {
  const {store, audio} = await openedStudyStore();

  renderHook(() => useCardAudio(), {wrapper: storeProviderOf(store), reactStrictMode: true});

  expect(audio.played).toEqual([KOREAN_WATER]);
});

it("says nothing once the session is over, and speaks again when the next one starts", async () => {
  const {store, audio} = await openedStudyStore();
  renderHook(() => useCardAudio(), {wrapper: storeProviderOf(store)});

  act(() => {
    store.dispatch(sessionEnded());
  });
  const afterEnd = audio.played.length;
  act(() => {
    store.dispatch(startSession("ko-starter"));
  });

  expect([afterEnd, audio.played.slice(afterEnd)]).toEqual([1, [KOREAN_WATER]]);
});
