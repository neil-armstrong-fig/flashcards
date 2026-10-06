import {readJson} from "@src/redux/shared/device-storage/ReadJson";

it("reads back what was stored", () => {
  localStorage.setItem("key", '{"a":1}');

  expect(readJson("key")).toEqual({a: 1});
});

it("reads nothing as undefined", () => {
  expect(readJson("key")).toBeUndefined();
});

it("reads invalid JSON as undefined rather than throwing", () => {
  localStorage.setItem("key", "{not json");

  expect(readJson("key")).toBeUndefined();
});

it("reads undefined when the browser refuses the read", () => {
  vi.stubGlobal("localStorage", {
    getItem: () => {
      throw new Error("blocked");
    },
  });

  expect(readJson("key")).toBeUndefined();
});
