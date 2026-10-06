import {runtime} from "@src/runtime/Runtime";
import {sleep} from "@src/runtime/Sleep";
import {waitBefore} from "@src/throttle/WaitBefore";

/**
 * Spaces requests out. The free tier allows 20 a minute and cannot be raised (`docs/audio.md`), so each request waits until
 * the interval has passed since the one before.
 */
export async function waitForTurn(): Promise<void> {
  const remaining = waitBefore(runtime.lastRequestAt, runtime.requestIntervalMs, Date.now());

  if (remaining > 0) {
    await sleep(remaining);
  }

  runtime.lastRequestAt = Date.now();
}
