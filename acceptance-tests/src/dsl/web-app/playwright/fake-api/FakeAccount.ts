import type {FakePicture} from "@src/dsl/web-app/playwright/fake-api/FakePicture";
import type {FakeStoredRecord} from "@src/dsl/web-app/playwright/fake-api/FakeStoredRecord";
import type {FakeSetting} from "@src/dsl/web-app/playwright/fake-api/FakeSetting";

/**
 * Everything the API keeps for the one learner: what a second device, opened on the same account, would find there. Two fake APIs
 * given the same account are two devices of one learner; each keeps to itself only whether it is signed in.
 */
export interface FakeAccount {
  /** The card events kept, in the order the API heard of them; an event's place here, from one, is its `seq`. */
  readonly events: unknown[];
  /** The synced settings as last chosen on any device, by name. */
  readonly settings: Record<string, FakeSetting>;
  /** What the learner made (cards, similar words, notes, pictures), as last changed, each with its place in the order they came in. */
  readonly records: FakeStoredRecord[];
  /** The pictures, by the hash of their bytes. */
  readonly pictures: Record<string, FakePicture>;
}
