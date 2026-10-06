import alchemy from "alchemy";
import {buildApiWorker} from "@src/api-worker/BuildApiWorker";
import {buildRecordings} from "@src/api-buckets/BuildRecordings";
import {buildApiDatabase} from "@src/api-database/BuildApiDatabase";
import {secrets} from "@src/secrets/Secrets";

/**
 * Everything the API needs on a Cloudflare account, and nothing else: the database, the private bucket of recordings, and the Worker bound to them (which makes its own key-value
 * namespaces and rate limiters). How each is built is in a folder of its own, so one can be read and changed alone.
 *
 * **Not here, on purpose:** the domain. The Worker is given its `workers.dev` address and a custom domain is attached by hand in
 * the dashboard, since which domain, and where its DNS lives, is the owner's.
 *
 * `pnpm --filter @language-learning/infra provision` runs it against the account `CLOUDFLARE_API_TOKEN` is for; see
 * `infra/AGENTS.md` for what to set first. Resources are adopted by name where they exist.
 */
const app = await alchemy("flashcards", {password: secrets.ALCHEMY_PASSWORD});

const database = await buildApiDatabase();
const recordings = await buildRecordings();
const apiWorker = await buildApiWorker({database, recordings});

// A deploy script's whole output is what it made, so the address is printed.
// eslint-disable-next-line no-console
console.log(`The API is at ${apiWorker.url}`);

await app.finalize();
