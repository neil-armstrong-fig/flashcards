import {saveJson} from "@src/storage/local-storage/device/SaveJson";

it("stores the value as JSON", () => {
  saveJson("key", {a: 1});

  expect(localStorage.getItem("key")).toBe('{"a":1}');
});

it("reports a refused save once per key and does not throw", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

  vi.stubGlobal("localStorage", {
    setItem: () => {
      throw new Error("quota");
    },
  });
  saveJson("refused-key", 1);
  saveJson("refused-key", 2);

  expect(error).toHaveBeenCalledTimes(1);
});
