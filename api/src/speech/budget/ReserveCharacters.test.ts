import {reserveCharacters} from "@src/speech/budget/ReserveCharacters";
import {testKvNamespace} from "@src/testing/kv/TestKvNamespace";

const OCTOBER = new Date("2026-10-05T10:00:00Z");

it("allows a request while there is room, and counts it", async () => {
  const store = testKvNamespace();

  expect(await reserveCharacters(store, {characters: 3, ceiling: 10, now: OCTOBER})).toBe(true);
  expect(await store.get("characters:2026-10")).toBe("3");
});

it("refuses a request that would pass the ceiling, and does not count it", async () => {
  const store = testKvNamespace();

  await reserveCharacters(store, {characters: 8, ceiling: 10, now: OCTOBER});

  expect(await reserveCharacters(store, {characters: 3, ceiling: 10, now: OCTOBER})).toBe(false);
  expect(await store.get("characters:2026-10")).toBe("8");
});

it("allows a request that lands exactly on the ceiling", async () => {
  expect(await reserveCharacters(testKvNamespace(), {characters: 10, ceiling: 10, now: OCTOBER})).toBe(true);
});

it("starts a new count each month", async () => {
  const store = testKvNamespace();

  await reserveCharacters(store, {characters: 10, ceiling: 10, now: OCTOBER});

  expect(await reserveCharacters(store, {characters: 5, ceiling: 10, now: new Date("2026-11-01T00:00:00Z")})).toBe(
    true,
  );
});

it("treats a count it cannot read as nothing used", async () => {
  const store = testKvNamespace();
  await store.put("characters:2026-10", "not a number");

  expect(await reserveCharacters(store, {characters: 1, ceiling: 10, now: OCTOBER})).toBe(true);
});
