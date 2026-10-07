import {downloadPicture} from "@src/redux/api/DownloadPicture";
import {hashOfPicture} from "@src/redux/slices/card-pictures/storage/HashOfPicture";
import {picturePayloadOf} from "@flashcards/shared/sync/records/RecordChange";
import {pictureKept, pictureRemoved, pictureRenewed} from "@src/redux/slices/card-pictures/CardPicturesSlice";
import {readKeptPicture} from "@src/redux/slices/card-pictures/storage/ReadKeptPicture";
import {renewStoredPicture} from "@src/redux/slices/card-pictures/storage/RenewStoredPicture";
import {storePicture} from "@src/redux/slices/card-pictures/storage/StorePicture";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";
import {forgetStoredPicture} from "@src/redux/slices/card-pictures/storage/ForgetStoredPicture";

/**
 * Takes in a picture the learner put on a card, or took off one, on another device. A picture this device has already (the same hash)
 * is only dated as it was there; a new one is fetched, by its hash, and kept. A failure to fetch fails the sync, which is tried again.
 * Nothing is recorded to send.
 */
export function applyPictureRecord(change: RecordChange): AppThunk<Promise<void>> {
  return async dispatch => {
    if (change.deleted) {
      await forgetStoredPicture(change.id);
      dispatch(pictureRemoved(change.id));

      return;
    }

    const wanted = picturePayloadOf(change);

    if (wanted === undefined) {
      return;
    }

    const kept = await readKeptPicture(change.id);

    if (kept !== undefined && (await hashOfPicture(kept.picture)) === wanted.hash) {
      await renewStoredPicture(change.id, change.at);
      dispatch(pictureRenewed({cardId: change.id, addedAt: change.at}));

      return;
    }

    const picture = await downloadPicture(wanted.hash);

    dispatch(
      pictureKept({cardId: change.id, address: await storePicture(change.id, picture, change.at), addedAt: change.at}),
    );
  };
}
