import {buzz} from "@src/haptics/Buzz";
import {vi} from "vitest";

it("asks the phone to vibrate for as long as it is told", () => {
  const vibrate = vi.fn();

  vi.stubGlobal("navigator", {vibrate});
  buzz(12);

  expect(vibrate).toHaveBeenCalledExactlyOnceWith(12);
});

it("does nothing on a device with no vibration motor", () => {
  vi.stubGlobal("navigator", {});

  expect(() => buzz(12)).not.toThrow();
});

it("does not throw when the browser refuses", () => {
  vi.stubGlobal("navigator", {
    vibrate: () => {
      throw new Error("Not allowed");
    },
  });
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  expect(() => buzz(12)).not.toThrow();
});
