import {setTimeout} from "node:timers/promises";

/** Waits. Its own module so that a test which must not wait can replace it. */
export async function sleep(ms: number): Promise<void> {
  await setTimeout(ms);
}
