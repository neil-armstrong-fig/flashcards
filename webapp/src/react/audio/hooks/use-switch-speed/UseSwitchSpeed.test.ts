// @vitest-environment jsdom
import {act, renderHook} from "@testing-library/react";
import {createStore} from "@src/redux/Store";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {storeProviderOf} from "@src/testing/StoreProviderOf";
import {useSwitchSpeed} from "@src/react/audio/hooks/use-switch-speed/UseSwitchSpeed";

it("switches the deck being studied to the other speed, keeps the choice for that deck alone, and says again at the new speed", async () => {
  const {store} = await openedStudyStore();
  const replay = vi.fn();
  const {result} = renderHook(() => useSwitchSpeed(replay), {wrapper: storeProviderOf(store)});

  act(() => result.current());

  expect(store.getState().settings.deckPreferences["ko-starter"]?.speed).toBe("slower");
  expect(store.getState().settings.deckPreferences["ja-hiragana"]?.speed).toBe("normal");
  expect(store.getState().settings.speed).toBe("normal");
  expect(replay).toHaveBeenCalledExactlyOnceWith({voice: "male", speed: "slower"});
});

it("switches back on the next tap, with nothing said when no replay is given", async () => {
  const {store} = await openedStudyStore();
  const {result} = renderHook(() => useSwitchSpeed(), {wrapper: storeProviderOf(store)});

  act(() => result.current());
  act(() => result.current());

  expect(store.getState().settings.deckPreferences["ko-starter"]?.speed).toBe("normal");
});

it("keeps the choice for browsing when no deck is being studied", () => {
  const store = createStore();
  const {result} = renderHook(() => useSwitchSpeed(), {wrapper: storeProviderOf(store)});

  act(() => result.current());

  expect(store.getState().settings.speed).toBe("slower");
  expect(store.getState().settings.deckPreferences["ko-starter"]?.speed).toBe("normal");
});
