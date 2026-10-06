import type {KeptPicture} from "@src/redux/slices/card-pictures/types/KeptPicture";

/** What IndexedDB keeps of the learner's pictures, in memory for a test: keeps the cards that have one and gives each an address made from its id. */
export class MemoryCardPictures {
  /** Card id to the date it was kept, so a test can read and plant them. */
  readonly kept = new Map<string, string>();
  failing = false;

  async load(): Promise<Readonly<Record<string, KeptPicture>>> {
    return Object.fromEntries(
      [...this.kept].map(([cardId, addedAt]) => [cardId, {address: `memory:${cardId}`, addedAt}]),
    );
  }

  async keep(cardId: string, _picture: Blob, addedAt: string): Promise<string> {
    if (this.failing) {
      throw new Error("The device is full.");
    }

    this.kept.set(cardId, addedAt);

    return `memory:${cardId}`;
  }

  async renew(cardId: string, addedAt: string): Promise<void> {
    if (this.kept.has(cardId)) {
      this.kept.set(cardId, addedAt);
    }
  }

  async remove(cardId: string): Promise<void> {
    this.kept.delete(cardId);
  }
}
