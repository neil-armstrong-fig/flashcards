import {hashOfPicture} from "@src/redux/slices/card-pictures/picture-processing/HashOfPicture";
import {BEFORE_ANY_CHANGE} from "@src/redux/shared/sync-records/builders/BeforeAnyChange";
import {hasAdoptedRecords} from "@src/storage/local-storage/sync/records-adopted/HasAdoptedRecords";
import {isPictureType} from "@flashcards/shared/sync/records/PictureType";
import {keepLocalRecord} from "@src/storage/index-db/sync/records/KeepLocalRecord";
import {keepRecordsAdopted} from "@src/storage/local-storage/sync/records-adopted/KeepRecordsAdopted";
import {memoryNoteRecord} from "@src/redux/shared/sync-records/builders/MemoryNoteRecord";
import {noteRecord} from "@src/redux/shared/sync-records/builders/NoteRecord";
import {pictureRecord} from "@src/redux/shared/sync-records/builders/PictureRecord";
import {readKeptPicture} from "@src/storage/index-db/pictures/ReadKeptPicture";
import {readLocalRecord} from "@src/storage/index-db/sync/records/ReadLocalRecord";
import {similarRecord} from "@src/redux/shared/sync-records/builders/SimilarRecord";
import type {AppThunk} from "@src/redux/shared/AppThunk";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/**
 * Once on each device, makes records of what it held before there were any (the cards the learner made, their similar words, their
 * notes and pictures), so that it is all sent online and found by their other devices. A thing that already has a record, from a
 * change made since or one heard from the API, is left as that says. Dated as the beginning of time (`BEFORE_ANY_CHANGE`, the builders' default), unless it has a date of its own, so
 * it never overrides a change made since.
 */
export function adoptLocalRecords(): AppThunk<Promise<void>> {
  return async (_dispatch, getState) => {
    if (hasAdoptedRecords()) {
      return;
    }

    const state = getState();
    const held: RecordChange[] = [
      ...state.deck.notes.map(note => noteRecord(note)),
      ...Object.entries(state.similar.words).flatMap(([noteId, words]) =>
        words.map(text => similarRecord({noteId, text})),
      ),
      ...Object.entries(state.cardNotes.byCard).map(([cardId, text]) =>
        memoryNoteRecord({cardId, text, at: datedOrOld(state.cardNotes.addedAt[cardId])}),
      ),
    ];

    for (const cardId of Object.keys(state.cardPictures.byCard)) {
      const kept = await readKeptPicture(cardId);

      if (kept !== undefined && isPictureType(kept.picture.type)) {
        held.push(
          pictureRecord({
            cardId,
            hash: await hashOfPicture(kept.picture),
            type: kept.picture.type,
            at: datedOrOld(kept.addedAt),
          }),
        );
      }
    }

    for (const record of held) {
      if ((await readLocalRecord(record.kind, record.id)) === undefined) {
        await keepLocalRecord(record);
      }
    }

    keepRecordsAdopted();
  };
}

function datedOrOld(addedAt: string | undefined): string {
  if (addedAt === undefined || Number.isNaN(new Date(addedAt).getTime())) {
    return BEFORE_ANY_CHANGE;
  }

  return addedAt;
}
