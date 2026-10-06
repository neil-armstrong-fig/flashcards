// @vitest-environment jsdom
import {act, renderHook} from "@testing-library/react";
import {createStore} from "@src/redux/Store";
import {deckSpeedChosen} from "@src/redux/slices/settings/SettingsSlice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {storeProviderOf} from "@src/testing/StoreProviderOf";
import {useSwitchVoice} from "@src/react/audio/hooks/use-switch-voice/UseSwitchVoice";

it("switches the deck being studied to the other voice, keeps the choice for that deck alone, and says again in the new voice", async () => {
  const {store} = await openedStudyStore();
  const replay = vi.fn();
  const {result} = renderHook(() => useSwitchVoice(replay), {wrapper: storeProviderOf(store)});

  act(() => result.current());

  expect(store.getState().settings.deckPreferences["ko-starter"]?.voice).toBe("female");
  expect(store.getState().settings.deckPreferences["ja-hiragana"]?.voice).toBe("male");
  expect(store.getState().settings.voice).toBe("male");
  expect(replay).toHaveBeenCalledExactlyOnceWith({voice: "female", speed: "normal"});
});

it("switches back on the next tap", async () => {
  const {store} = await openedStudyStore();
  const {result} = renderHook(() => useSwitchVoice(), {wrapper: storeProviderOf(store)});

  act(() => result.current());
  act(() => result.current());

  expect(store.getState().settings.deckPreferences["ko-starter"]?.voice).toBe("male");
});

it("keeps the speed chosen when the voice is switched", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(deckSpeedChosen({deckId: "ko-starter", speed: "slower"}));
  const replay = vi.fn();
  const {result} = renderHook(() => useSwitchVoice(replay), {wrapper: storeProviderOf(store)});

  act(() => result.current());

  expect(replay).toHaveBeenCalledExactlyOnceWith({voice: "female", speed: "slower"});
});

it("keeps the choice for browsing when no deck is being studied", () => {
  const store = createStore();
  const {result} = renderHook(() => useSwitchVoice(), {wrapper: storeProviderOf(store)});

  act(() => result.current());

  expect(store.getState().settings.voice).toBe("female");
  expect(store.getState().settings.deckPreferences["ko-starter"]?.voice).toBe("male");
});
