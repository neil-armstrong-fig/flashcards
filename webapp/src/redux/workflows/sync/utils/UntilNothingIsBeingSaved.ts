import type {RootState} from "@src/redux/Store";

const CHECK_EVERY_MS = 25;
const GIVE_UP_AFTER_MS = 3_000;

/**
 * Waits while an answer or a card being set aside is being saved. A pull that replays that card meanwhile would be written over by
 * the answer's own result, worked out without it, and the screen would show the older state until the next load. Gives up after a
 * few seconds, failing the sync (it is tried again), so a save that never ends cannot hold it for ever.
 */
export async function untilNothingIsBeingSaved(getState: () => RootState): Promise<void> {
  const started = Date.now();

  while (getState().study.session?.saving) {
    if (Date.now() - started > GIVE_UP_AFTER_MS) {
      throw new Error("A save did not finish, so the sync waited too long.");
    }

    await new Promise(resolve => setTimeout(resolve, CHECK_EVERY_MS));
  }
}
