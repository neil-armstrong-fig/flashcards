/**
 * The object stores of the study database: a record per card, the log of every answer, the events a replay rebuilds a card from
 * (`docs/sync.md`), and the copy of those this device has made that the API has not yet been sent. `records` holds the latest change this device knows of to each
 * thing the learner made (their own cards, similar words, notes and pictures), and `unsent-records` the changes made here the API has not been sent.
 */
export const STUDY_STORES = {
  cards: "cards",
  log: "log",
  events: "events",
  unsent: "unsent",
  records: "records",
  unsentRecords: "unsent-records",
} as const;
