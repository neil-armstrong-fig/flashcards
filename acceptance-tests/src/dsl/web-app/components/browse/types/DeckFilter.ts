import type {DeckId} from "@src/dsl/web-app/types/DeckId";

/** What the list of every card is narrowed to: one deck, or `all` of them. */
export type DeckFilter = DeckId | "all";
