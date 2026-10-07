import {englishMeaningFrom} from "@flashcards/shared/language/EnglishText";
import {koreanWordFrom} from "@flashcards/shared/language/KoreanText";
import {PICTURE_TYPES} from "@flashcards/shared/sync/records/PictureType";
import {RECORD_KINDS} from "@flashcards/shared/sync/records/RecordKind";
import {romanisationFrom} from "@flashcards/shared/language/RomanisationText";
import type {PictureType} from "@flashcards/shared/sync/records/PictureType";
import type {RecordKind} from "@flashcards/shared/sync/records/RecordKind";
import type {
  MemoryNotePayload,
  NotePayload,
  PicturePayload,
  RecordPayload,
  SimilarPayload,
} from "@flashcards/shared/sync/records/RecordPayload";

/** The longest a note on a card may be. */
export const MAXIMUM_MEMORY_NOTE_LENGTH = 280;

const NOTE_ID = /^ko-custom-[a-z0-9-]+$/;
const CARD_ID = /^[a-z0-9-]+\/(to-english|from-english)$/;
const NOTE_OR_SHIPPED_ID = /^[a-z0-9-]+$/;
const HASH = /^[0-9a-f]{64}$/;
const MAXIMUM_ID_LENGTH = 64;

/**
 * One thing the learner made, changed or removed, at a moment. The later change to the same thing (a `kind` and an `id`) wins,
 * wherever it was made. A removal is kept as a record with `deleted` set, so a device that has not heard of it yet does not bring
 * the thing back (`docs/sync.md`). Where it is not removed, `payload` is what the kind needs.
 */
export interface RecordChange {
  readonly kind: RecordKind;
  readonly id: string;
  /** When it was changed, as an ISO timestamp. */
  readonly at: string;
  readonly deleted: boolean;
  /** Absent for a removal. */
  readonly payload?: RecordPayload;
}

/** A record change from storage or the network, or `undefined` if what arrived is not one. */
export function readRecordChange(value: unknown): RecordChange | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const {kind, id, at, deleted, payload} = value as Record<string, unknown>;

  if (!RECORD_KINDS.some(known => known === kind) || typeof id !== "string" || !isTimestamp(at)) {
    return undefined;
  }

  if (typeof deleted !== "boolean" || !isIdOf(kind as RecordKind, id)) {
    return undefined;
  }

  if (deleted) {
    return {kind: kind as RecordKind, id, at, deleted};
  }

  const read = readPayload(kind as RecordKind, id, payload);

  if (read === undefined) {
    return undefined;
  }

  return {kind: kind as RecordKind, id, at, deleted, payload: read};
}

function isIdOf(kind: RecordKind, id: string): boolean {
  if (id.length === 0 || id.length > MAXIMUM_ID_LENGTH + 40) {
    return false;
  }

  if (kind === "note") {
    return id.length <= MAXIMUM_ID_LENGTH && NOTE_ID.test(id);
  }

  if (kind === "similar") {
    return id.includes("|");
  }

  return CARD_ID.test(id);
}

function readPayload(kind: RecordKind, id: string, payload: unknown): RecordPayload | undefined {
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  const fields = payload as Record<string, unknown>;

  if (kind === "note") {
    return readNote(fields);
  }

  if (kind === "similar") {
    return readSimilar(id, fields);
  }

  if (kind === "memory-note") {
    return readMemoryNote(fields);
  }

  return readPicture(fields);
}

function readNote({word, meaning, romanisation}: Record<string, unknown>): RecordPayload | undefined {
  if (typeof word !== "string" || typeof meaning !== "string" || typeof romanisation !== "string") {
    return undefined;
  }

  const checkedWord = koreanWordFrom(word);
  const checkedMeaning = englishMeaningFrom(meaning);
  const checkedRomanisation = romanisationFrom(romanisation);

  if (checkedWord === undefined || checkedMeaning === undefined || checkedRomanisation === undefined) {
    return undefined;
  }

  return {word: checkedWord, meaning: checkedMeaning, romanisation: checkedRomanisation};
}

function readSimilar(id: string, {noteId, text}: Record<string, unknown>): RecordPayload | undefined {
  if (typeof noteId !== "string" || typeof text !== "string") {
    return undefined;
  }

  const checked = koreanWordFrom(text);

  if (checked === undefined || !NOTE_OR_SHIPPED_ID.test(noteId) || noteId.length > MAXIMUM_ID_LENGTH) {
    return undefined;
  }

  if (id !== `${noteId}|${checked}`) {
    return undefined;
  }

  return {noteId, text: checked};
}

function readMemoryNote({text}: Record<string, unknown>): RecordPayload | undefined {
  if (typeof text !== "string") {
    return undefined;
  }

  const trimmed = text.trim();

  if (trimmed.length === 0 || trimmed.length > MAXIMUM_MEMORY_NOTE_LENGTH) {
    return undefined;
  }

  return {text: trimmed};
}

function readPicture({hash, type}: Record<string, unknown>): RecordPayload | undefined {
  if (typeof hash !== "string" || !HASH.test(hash) || !PICTURE_TYPES.some(known => known === type)) {
    return undefined;
  }

  return {hash, type: type as PictureType};
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(new Date(value).getTime());
}

/** The words of a card the learner made, from its record, or `undefined` where the record is not one that has them. */
export function notePayloadOf(change: RecordChange): NotePayload | undefined {
  const {payload} = change;

  if (change.kind === "note" && payload !== undefined && "word" in payload) {
    return payload;
  }

  return undefined;
}

/** The card and word of a similar word, from its record, or `undefined` where the record is not one that has them. */
export function similarPayloadOf(change: RecordChange): SimilarPayload | undefined {
  const {payload} = change;

  if (change.kind === "similar" && payload !== undefined && "noteId" in payload) {
    return payload;
  }

  return undefined;
}

/** The text of a note on a card, from its record, or `undefined` where the record is not one that has it. */
export function memoryNotePayloadOf(change: RecordChange): MemoryNotePayload | undefined {
  const {payload} = change;

  if (change.kind === "memory-note" && payload !== undefined && "text" in payload && !("noteId" in payload)) {
    return payload;
  }

  return undefined;
}

/** The hash and type of a picture on a card, from its record, or `undefined` where the record is not one that has them. */
export function picturePayloadOf(change: RecordChange): PicturePayload | undefined {
  const {payload} = change;

  if (change.kind === "picture" && payload !== undefined && "hash" in payload) {
    return payload;
  }

  return undefined;
}
