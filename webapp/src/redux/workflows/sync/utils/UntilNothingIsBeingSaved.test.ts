import {untilNothingIsBeingSaved} from "@src/redux/workflows/sync/utils/UntilNothingIsBeingSaved";
import type {RootState} from "@src/redux/Store";

function stateSaving(saving: boolean): RootState {
  return {study: {session: {saving}}} as unknown as RootState;
}

afterEach(() => {
  vi.useRealTimers();
});

it("returns at once when nothing is being saved", async () => {
  await expect(untilNothingIsBeingSaved(() => stateSaving(false))).resolves.toBeUndefined();
});

it("waits for a save to finish", async () => {
  vi.useFakeTimers();
  let saving = true;
  let done = false;
  const waiting = untilNothingIsBeingSaved(() => stateSaving(saving)).then(() => {
    done = true;
  });

  await vi.advanceTimersByTimeAsync(500);
  expect(done).toBe(false);

  saving = false;
  await vi.advanceTimersByTimeAsync(50);
  await waiting;

  expect(done).toBe(true);
});

it("fails when a save never finishes, so the sync is tried again later", async () => {
  vi.useFakeTimers();
  const waiting = untilNothingIsBeingSaved(() => stateSaving(true));
  const failure = expect(waiting).rejects.toThrow("waited too long");

  await vi.advanceTimersByTimeAsync(4_000);
  await failure;
});
