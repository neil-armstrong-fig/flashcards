import {hashOfPicture} from "@src/redux/slices/card-pictures/storage/HashOfPicture";
import {picturePayloadOf} from "@flashcards/shared/sync/records/RecordChange";
import {readKeptPicture} from "@src/redux/slices/card-pictures/storage/ReadKeptPicture";
import {uploadPicture} from "@src/redux/api/UploadPicture";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/**
 * Sends the bytes of every picture about to be announced, before the announcement, so that no device is told of a picture it cannot
 * then fetch. A picture the card no longer has, or has changed since (its hash is another), is skipped: a later change will announce
 * the one it has. A failure to send fails the sync, and the pictures are sent again with it.
 */
export async function uploadUnsentPictures(changes: readonly RecordChange[]): Promise<void> {
  for (const change of changes) {
    const wanted = picturePayloadOf(change);

    if (wanted === undefined) {
      continue;
    }

    const kept = await readKeptPicture(change.id);

    if (kept !== undefined && (await hashOfPicture(kept.picture)) === wanted.hash) {
      await uploadPicture(wanted.hash, kept.picture);
    }
  }
}
