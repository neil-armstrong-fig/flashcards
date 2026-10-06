// @vitest-environment jsdom
import {act, renderHook} from "@testing-library/react";
import {speedChosen} from "@src/redux/slices/settings/SettingsSlice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {storeProviderOf} from "@src/testing/StoreProviderOf";
import {useSwitchVoice} from "@src/react/audio/hooks/use-switch-voice/UseSwitchVoice";

it("switches to the other voice, keeps the choice, and says again in the new voice", async () => {
  const {store} = await openedStudyStore();
  const replay = vi.fn();
  const {result} = renderHook(() => useSwitchVoice(replay), {wrapper: storeProviderOf(store)});

  act(() => result.current());

  expect(store.getState().settings.voice).toBe("male");
  expect(replay).toHaveBeenCalledExactlyOnceWith({voice: "male", speed: "normal"});
});

it("switches back on the next tap", async () => {
  const {store} = await openedStudyStore();
  const {result} = renderHook(() => useSwitchVoice(), {wrapper: storeProviderOf(store)});

  act(() => result.current());
  act(() => result.current());

  expect(store.getState().settings.voice).toBe("female");
});

it("keeps the speed chosen when the voice is switched", async () => {
  const {store} = await openedStudyStore();
  store.dispatch(speedChosen("slower"));
  const replay = vi.fn();
  const {result} = renderHook(() => useSwitchVoice(replay), {wrapper: storeProviderOf(store)});

  act(() => result.current());

  expect(replay).toHaveBeenCalledExactlyOnceWith({voice: "male", speed: "slower"});
});
