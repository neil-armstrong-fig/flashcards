/** The word a card belongs to: card ids are `<note id>/<direction>`, so the note is everything before the last slash. */
export function noteIdOfCard(cardId: string): string {
  return cardId.slice(0, cardId.lastIndexOf("/"));
}
