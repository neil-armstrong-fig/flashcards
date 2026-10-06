/** What the list of every card is narrowed to: one deck, or every deck. A deck whose id is `all` cannot be mistaken for every deck. */
export type DeckFilter = {readonly kind: "all"} | {readonly kind: "deck"; readonly deckId: string};
