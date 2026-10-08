import type {CardState} from "@src/spaced-repetition/card/types/CardState";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {StoredStudy} from "@src/storage/index-db/study/types/StoredStudy";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";

/** What the browser's IndexedDB keeps of study progress, held in memory for a test. */
export class MemoryStudyStorage {
  private cards: Record<string, CardState> = {};
  private log: ReviewLogEntry[] = [];

  load(): Promise<StoredStudy> {
    return Promise.resolve({cards: {...this.cards}, log: [...this.log]});
  }

  recordAnswer(card: StudyCard, entry: ReviewLogEntry): Promise<void> {
    this.cards[card.id] = card.state;
    this.log.push(entry);

    return Promise.resolve();
  }

  saveCard(card: StudyCard): Promise<void> {
    this.cards[card.id] = card.state;

    return Promise.resolve();
  }
}
