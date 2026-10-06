import type {KeptNote} from "@src/redux/slices/account/types/KeptNote";
import type {KeptWords} from "@src/redux/slices/account/types/KeptWords";

/** The API's account side, in memory for a test: says who is signed in, keeps words and cards, and can be told to be unreachable. */
export class FakeAccountApi {
  email: string | undefined;
  unreachable = false;
  kept: Record<string, string[]> = {};
  notes: KeptNote[] = [];
  signInAsked = false;

  signIn(): void {
    this.signInAsked = true;
  }

  async readMe(): Promise<string | undefined> {
    this.throwIfUnreachable();

    return this.email;
  }

  async signOut(): Promise<void> {
    this.throwIfUnreachable();
    this.email = undefined;
  }

  async readSimilar(): Promise<KeptWords> {
    this.throwIfUnreachable();

    return this.kept;
  }

  async addSimilar(noteId: string, text: string): Promise<void> {
    this.throwIfUnreachable();
    this.kept[noteId] = [...(this.kept[noteId] ?? []), text];
  }

  async removeSimilar(noteId: string, text: string): Promise<void> {
    this.throwIfUnreachable();
    this.kept[noteId] = (this.kept[noteId] ?? []).filter(word => word !== text);
  }

  async readNotes(): Promise<readonly KeptNote[]> {
    this.throwIfUnreachable();

    return this.notes;
  }

  async addNote(note: KeptNote): Promise<void> {
    this.throwIfUnreachable();
    this.notes = [...this.notes, note];
  }

  async editNote(note: KeptNote): Promise<void> {
    this.throwIfUnreachable();
    if (!this.notes.some(each => each.id === note.id)) {
      throw new Error("There is no such card.");
    }
    this.notes = this.notes.map(each => (each.id === note.id ? note : each));
  }

  async removeNote(id: string): Promise<void> {
    this.throwIfUnreachable();
    this.notes = this.notes.filter(note => note.id !== id);
    delete this.kept[id];
  }

  private throwIfUnreachable(): void {
    if (this.unreachable) {
      throw new Error("The API cannot be reached.");
    }
  }
}
