import type {DBSchema} from "idb";

/**
 * The study database as `idb` types it: each store's key, and `unknown` for every value, because what is read back is checked by a
 * reader (`readCardState`, `readCardEvent`, ...) before anything trusts it. The names are `STUDY_STORES`.
 */
export interface StudyDatabase extends DBSchema {
  cards: {key: string; value: unknown};
  log: {key: [string, string]; value: unknown};
  events: {key: [string, string, string]; value: unknown};
  unsent: {key: [string, string, string]; value: unknown};
  records: {key: [string, string]; value: unknown};
  "unsent-records": {key: [string, string]; value: unknown};
}
