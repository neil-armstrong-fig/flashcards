import {R2Bucket} from "alchemy/cloudflare";

/**
 * The private bucket of the learner's pictures, one object for each picture under the account and the hash of its bytes
 * (`api/src/router/routes/pictures/`). Never public, like the recordings. Adopted by name where it exists, and **kept when the rest is
 * destroyed** (`delete: false`): a picture is something the learner made and nothing else has a copy.
 */
export async function buildPictures(): Promise<R2Bucket> {
  return await R2Bucket("pictures", {
    name: "flashcards-pictures",
    adopt: true,
    delete: false,
    empty: false,
  });
}
