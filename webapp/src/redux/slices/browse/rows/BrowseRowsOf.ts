import {cardStatusOf} from "@src/spaced-repetition/card/CardStatusOf";
import type {BrowseRow} from "@src/redux/slices/browse/types/BrowseRow";
import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {DeckCard} from "@flashcards/content/types/DeckCard";
import type {SpokenText} from "@flashcards/content/types/SpokenText";

/** Every card of the deck, in the order new ones are introduced, narrowed to those whose words, meaning or way of saying it contain `query`. */
export function browseRowsOf(
  cards: readonly DeckCard[],
  states: Readonly<Record<string, CardState>>,
  now: Date,
  query: string,
): BrowseRow[] {
  const wanted = query.trim().toLowerCase();
  const rows: BrowseRow[] = [];

  for (const card of cards) {
    const state = states[card.id];

    if (!state || !matches(card, wanted)) {
      continue;
    }

    rows.push({
      id: card.id,
      noteId: card.noteId,
      front: card.front,
      notation: card.notation,
      back: card.back,
      hint: card.hint,
      spoken: spokenOf(card),
      status: cardStatusOf(state, now),
    });
  }

  return rows;
}

function matches(card: DeckCard, wanted: string): boolean {
  if (wanted === "") {
    return true;
  }

  return [card.front, card.back, card.hint].some(text => text.toLowerCase().includes(wanted));
}

/** Whichever of a card's two sides is spoken in the language being learned (for a kana, the only side spoken). */
function spokenOf(card: DeckCard): SpokenText | undefined {
  return [card.frontAudio, card.backAudio].find(audio => audio !== undefined && audio.language !== "en");
}
