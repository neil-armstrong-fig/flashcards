import type {KeptPicture} from "@src/redux/slices/card-pictures/types/KeptPicture";

/** What IndexedDB keeps of the learner's pictures, in memory for a test: keeps the cards that have one and gives each an address made from its id. */
export class MemoryCardPictures {
  /** Card id to the date it was kept, so a test can read and plant them. */
  readonly kept = new Map<string, string>();
  /** Card id to the picture itself, for a test that cares which picture it is. A picture kept by the app is here; one a test plants with `kept` alone is not. */
  readonly blobs = new Map<string, Blob>();
  failing = false;

  async load(): Promise<Readonly<Record<string, KeptPicture>>> {
    return Object.fromEntries(
      [...this.kept].map(([cardId, addedAt]) => [cardId, {address: `memory:${cardId}`, addedAt}]),
    );
  }

  async keep(cardId: string, picture: Blob, addedAt: string): Promise<string> {
    if (this.failing) {
      throw new Error("The device is full.");
    }

    this.kept.set(cardId, addedAt);
    this.blobs.set(cardId, picture);

    return `memory:${cardId}`;
  }

  async renew(cardId: string, addedAt: string): Promise<Blob | undefined> {
    if (this.kept.has(cardId)) {
      this.kept.set(cardId, addedAt);
    }

    return this.blobs.get(cardId);
  }

  async read(cardId: string): Promise<{readonly picture: Blob; readonly addedAt: string} | undefined> {
    const picture = this.blobs.get(cardId);
    const addedAt = this.kept.get(cardId);

    if (picture === undefined || addedAt === undefined) {
      return undefined;
    }

    return {picture, addedAt};
  }

  async remove(cardId: string): Promise<void> {
    this.kept.delete(cardId);
    this.blobs.delete(cardId);
  }
}
