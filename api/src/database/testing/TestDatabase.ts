import type {Account} from "@src/database/types/Account";
import type {SimilarWord} from "@src/database/types/SimilarWord";
import type {NewAccount} from "@src/database/types/NewAccount";
import type {NewNote} from "@src/database/types/NewNote";
import type {Note} from "@src/database/types/Note";
import type {NewSimilarWord} from "@src/database/types/NewSimilarWord";
import type {NewSession} from "@src/database/types/NewSession";

interface StoredAccount extends Account {
  readonly googleSub: string;
}

/**
 * The database in memory: what every database function does, kept in arrays, so a test of a route runs the real route over a world
 * it controls (`SetupApiTests` points the real functions here). One instance, emptied before each test.
 */
class TestDatabase {
  private accounts: StoredAccount[] = [];
  private sessions: NewSession[] = [];
  private words: (NewSimilarWord & {readonly order: number})[] = [];
  private notes: NewNote[] = [];

  reset(): void {
    this.accounts = [];
    this.sessions = [];
    this.words = [];
    this.notes = [];
  }

  readonly findOrCreateAccount = async (googleSub: string, newAccount: NewAccount): Promise<Account> => {
    const known = this.accounts.find(account => account.googleSub === googleSub);

    if (known) {
      return {id: known.id, email: known.email};
    }

    this.accounts.push({id: newAccount.id, email: newAccount.email, googleSub});

    return {id: newAccount.id, email: newAccount.email};
  };

  readonly createSession = async (session: NewSession): Promise<void> => {
    this.sessions.push(session);
  };

  readonly deleteSession = async (idHash: string): Promise<void> => {
    this.sessions = this.sessions.filter(session => session.idHash !== idHash);
  };

  readonly accountOfSession = async (idHash: string, now: Date): Promise<Account | undefined> => {
    const session = this.sessions.find(each => each.idHash === idHash && each.expiresAt > now);
    const account = this.accounts.find(each => each.id === session?.userId);

    if (!account) {
      return undefined;
    }

    return {id: account.id, email: account.email};
  };

  readonly listSimilarWords = async (userId: string): Promise<SimilarWord[]> => {
    return this.words
      .filter(word => word.userId === userId)
      .sort((a, b) => a.order - b.order)
      .map(({noteId, text}) => ({noteId, text}));
  };

  readonly saveSimilarWord = async (word: NewSimilarWord): Promise<void> => {
    const there = this.words.some(
      each => each.userId === word.userId && each.noteId === word.noteId && each.text === word.text,
    );

    if (!there) {
      this.words.push({...word, order: this.words.length});
    }
  };

  readonly deleteSimilarWord = async (userId: string, {noteId, text}: SimilarWord): Promise<void> => {
    this.words = this.words.filter(word => !(word.userId === userId && word.noteId === noteId && word.text === text));
  };

  readonly listNotes = async (userId: string): Promise<Note[]> => {
    return this.notes
      .filter(note => note.userId === userId)
      .map(({id, word, meaning, romanisation}) => ({id, word, meaning, romanisation}));
  };

  readonly saveNote = async (note: NewNote): Promise<void> => {
    const there = this.notes.some(each => each.userId === note.userId && each.id === note.id);

    if (!there) {
      this.notes.push(note);
    }
  };

  readonly updateNote = async (userId: string, {id, word, meaning, romanisation}: Note): Promise<boolean> => {
    const index = this.notes.findIndex(note => note.userId === userId && note.id === id);
    const kept = this.notes[index];

    if (!kept) {
      return false;
    }
    this.notes[index] = {...kept, word, meaning, romanisation};

    return true;
  };

  readonly deleteNote = async (userId: string, id: string): Promise<void> => {
    this.notes = this.notes.filter(note => !(note.userId === userId && note.id === id));
    this.words = this.words.filter(word => !(word.userId === userId && word.noteId === id));
  };

  get sessionCount(): number {
    return this.sessions.length;
  }
}

export const testDatabase = new TestDatabase();
