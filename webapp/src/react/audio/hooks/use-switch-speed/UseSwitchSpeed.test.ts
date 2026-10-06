// @vitest-environment jsdom
import {act, renderHook} from "@testing-library/react";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {storeProviderOf} from "@src/testing/StoreProviderOf";
import {useSwitchSpeed} from "@src/react/audio/hooks/use-switch-speed/UseSwitchSpeed";

it("switches to the other speed, keeps the choice, and says again at the new speed", async () => {
  const {store} = await openedStudyStore();
  const replay = vi.fn();
  const {result} = renderHook(() => useSwitchSpeed(replay), {wrapper: storeProviderOf(store)});

  act(() => result.current());

  expect(store.getState().settings.speed).toBe("slower");
  expect(replay).toHaveBeenCalledExactlyOnceWith({voice: "female", speed: "slower"});
});

it("switches back on the next tap, with nothing said when no replay is given", async () => {
  const {store} = await openedStudyStore();
  const {result} = renderHook(() => useSwitchSpeed(), {wrapper: storeProviderOf(store)});

  act(() => result.current());
  act(() => result.current());

  expect(store.getState().settings.speed).toBe("normal");
});
