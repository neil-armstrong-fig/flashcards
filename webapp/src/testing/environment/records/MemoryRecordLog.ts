import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";

/**
 * What the device holds of what the learner made, in memory for a test: the changes made here to be sent online, in order, the latest
 * change known to each thing (made here or heard from another device), and the pictures kept online that can be fetched by hash.
 */
export class MemoryRecordLog {
  readonly kept: RecordChange[] = [];
  readonly known = new Map<string, RecordChange>();
  /** Pictures kept online, by hash, for a test to plant. */
  readonly online = new Map<string, Blob>();
  /** Set to make a picture fail to be fetched, as when the connection is lost. */
  downloadFails = false;

  async keep(change: RecordChange): Promise<void> {
    this.kept.push(change);
    this.known.set(this.keyOf(change.kind, change.id), change);
  }

  async hear(change: RecordChange): Promise<void> {
    this.known.set(this.keyOf(change.kind, change.id), change);
  }

  async read(kind: string, id: string): Promise<RecordChange | undefined> {
    return this.known.get(this.keyOf(kind, id));
  }

  async download(hash: string): Promise<Blob> {
    const picture = this.online.get(hash);

    if (this.downloadFails || picture === undefined) {
      throw new Error("The picture could not be fetched.");
    }

    return picture;
  }

  /** What was kept of one kind, as `kind id deleted`, so an expectation reads as a list of what happened. */
  summary(): string[] {
    return this.kept.map(({kind, id, deleted}) => `${kind} ${id} ${deleted ? "removed" : "kept"}`);
  }

  private keyOf(kind: string, id: string): string {
    return `${kind}|${id}`;
  }
}
