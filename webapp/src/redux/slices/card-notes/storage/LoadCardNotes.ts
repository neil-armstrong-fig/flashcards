import {CARD_NOTES_STORAGE_KEY} from "@src/redux/slices/card-notes/storage/CardNotesStorageKey";
import {INITIAL_CARD_NOTES_STATE} from "@src/redux/slices/card-notes/initial-state/InitialCardNotesState";
import {MAXIMUM_NOTE_LENGTH} from "@src/redux/slices/card-notes/limits/MaximumNoteLength";
import {readJson} from "@src/redux/shared/device-storage/ReadJson";
import type {CardNotesState} from "@src/redux/slices/card-notes/types/CardNotesState";

/** The notes kept on this device. What is stored is untrusted: anything that is not a non-empty, short-enough text is dropped. */
export function loadCardNotes(): CardNotesState {
  const stored = readJson(CARD_NOTES_STORAGE_KEY);

  if (typeof stored !== "object" || stored === null || !("byCard" in stored)) {
    return INITIAL_CARD_NOTES_STATE;
  }

  const {byCard} = stored;

  if (typeof byCard !== "object" || byCard === null) {
    return INITIAL_CARD_NOTES_STATE;
  }

  const stamps = stampsOf(stored);
  const kept: Record<string, string> = {};
  const keptAddedAt: Record<string, string> = {};

  for (const [cardId, text] of Object.entries(byCard)) {
    if (typeof text === "string" && text.trim() !== "" && text.length <= MAXIMUM_NOTE_LENGTH) {
      kept[cardId] = text;
      keptAddedAt[cardId] = stampOf(stamps, cardId);
    }
  }

  return {byCard: kept, addedAt: keptAddedAt};
}

/** The dates the notes were written, by card id, or none when what was stored has none (notes kept before they were dated). */
function stampsOf(stored: object): object {
  if (!("addedAt" in stored) || typeof stored.addedAt !== "object" || stored.addedAt === null) {
    return {};
  }

  return stored.addedAt;
}

/** When a note was written, or an empty text when what was stored did not say (a note kept before notes were dated). */
function stampOf(stamps: object, cardId: string): string {
  const stamp: unknown = Object.entries(stamps).find(([id]) => id === cardId)?.[1];

  if (typeof stamp === "string") {
    return stamp;
  }

  return "";
}
