import {workerEnvironment} from "@src/env/WorkerEnvironment";

/** Whether this address may make another sign-in attempt this minute (the `LOGIN_LIMITER` binding). */
export async function loginAllowed(client: string): Promise<boolean> {
  return (await workerEnvironment.LOGIN_LIMITER.limit({key: client})).success;
}
