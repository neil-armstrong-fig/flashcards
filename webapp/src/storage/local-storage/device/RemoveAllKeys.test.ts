import {removeAllKeys} from "@src/storage/local-storage/device/RemoveAllKeys";

it("removes every key the app keeps", () => {
  localStorage.setItem("flashcards.settings.v1", "{}");
  localStorage.setItem("flashcards.deck.v1", "[]");

  removeAllKeys();

  expect(localStorage.getItem("flashcards.settings.v1")).toBeNull();
  expect(localStorage.getItem("flashcards.deck.v1")).toBeNull();
});

it("leaves what something else keeps", () => {
  localStorage.setItem("other.setting", "1");

  removeAllKeys();

  expect(localStorage.getItem("other.setting")).toBe("1");
});

it("reports a storage that cannot be read and does not throw", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

  vi.stubGlobal("localStorage", {
    get length(): number {
      throw new Error("blocked");
    },
  });

  expect(() => removeAllKeys()).not.toThrow();
  expect(error).toHaveBeenCalledTimes(1);
});
