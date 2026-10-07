import type {FakeAccount} from "@src/dsl/web-app/playwright/fake-api/FakeAccount";

/** An account with nothing kept online, or with whatever is given: what a second device finds, or what a spec plants for one to find. */
export function newFakeAccount({
  events = [],
  settings = {},
  records = [],
  pictures = {},
}: Partial<FakeAccount> = {}): FakeAccount {
  return {events, settings, records, pictures};
}
