import {cardEventId} from "@flashcards/shared/sync/card-events/CardEventId";
import type {CardEvent} from "@flashcards/shared/sync/card-events/CardEvent";
import type {StoredCardEvent} from "@src/database/types/StoredCardEvent";
import {isLaterChoice} from "@flashcards/shared/sync/IsLaterChoice";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";
import type {StoredRecordChange} from "@src/database/types/StoredRecordChange";
import type {SettingChange} from "@flashcards/shared/sync/settings/SettingChange";
import type {Account} from "@src/database/types/Account";
import type {NewAccount} from "@src/database/types/NewAccount";
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
  private settings: (SettingChange & {readonly userId: string})[] = [];
  private records: (StoredRecordChange & {readonly userId: string})[] = [];
  private events: (StoredCardEvent & {readonly userId: string})[] = [];

  reset(): void {
    this.accounts = [];
    this.sessions = [];
    this.events = [];
    this.settings = [];
    this.records = [];
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

  readonly saveCardEvents = async (userId: string, events: readonly CardEvent[]): Promise<void> => {
    for (const event of events) {
      const there = this.events.some(each => each.userId === userId && cardEventId(each.event) === cardEventId(event));

      if (!there) {
        this.events.push({userId, seq: this.events.length + 1, event});
      }
    }
  };

  readonly listCardEventsAfter = async (userId: string, cursor: number, limit: number): Promise<StoredCardEvent[]> => {
    return this.events
      .filter(each => each.userId === userId && each.seq > cursor)
      .slice(0, limit)
      .map(({seq, event}) => ({seq, event}));
  };

  readonly saveSettingChanges = async (userId: string, changes: readonly SettingChange[]): Promise<void> => {
    for (const change of changes) {
      const index = this.settings.findIndex(each => each.userId === userId && each.name === change.name);
      const kept = this.settings[index];

      if (!kept) {
        this.settings.push({userId, ...change});
      } else if (isLaterChoice(change.at, kept.at)) {
        this.settings[index] = {userId, ...change};
      }
    }
  };

  readonly listSettingChanges = async (userId: string): Promise<SettingChange[]> => {
    return this.settings.filter(each => each.userId === userId).map(({name, value, at}) => ({name, value, at}));
  };

  readonly saveRecordChanges = async (userId: string, changes: readonly RecordChange[]): Promise<void> => {
    for (const record of changes) {
      const index = this.records.findIndex(
        each => each.userId === userId && each.record.kind === record.kind && each.record.id === record.id,
      );
      const kept = this.records[index];

      if (kept && !isLaterChoice(record.at, kept.record.at)) {
        continue;
      }

      const seq = Math.max(0, ...this.records.map(each => each.seq)) + 1;

      if (kept) {
        this.records[index] = {userId, seq, record};
      } else {
        this.records.push({userId, seq, record});
      }
    }
  };

  readonly listRecordChangesAfter = async (
    userId: string,
    cursor: number,
    limit: number,
  ): Promise<StoredRecordChange[]> => {
    return this.records
      .filter(each => each.userId === userId && each.seq > cursor)
      .sort((a, b) => a.seq - b.seq)
      .slice(0, limit)
      .map(({seq, record}) => ({seq, record}));
  };

  get sessionCount(): number {
    return this.sessions.length;
  }
}

export const testDatabase = new TestDatabase();
