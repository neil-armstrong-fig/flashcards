import {R2Bucket} from "alchemy/cloudflare";

/**
 * The private bucket of recordings, which only a signed-in learner may be served (`api/src/buckets/`). Never public: no `r2.dev`
 * address and no custom domain, so the API alone serves it (`docs/online.md`). Adopted by name where it
 * exists, and **kept when the rest is destroyed** (`delete: false`): its contents took a long time to make and are not in the repository.
 */
export async function buildRecordings(): Promise<R2Bucket> {
  return await R2Bucket("recordings", {
    name: "flashcards-recordings",
    adopt: true,
    delete: false,
    empty: false,
  });
}
