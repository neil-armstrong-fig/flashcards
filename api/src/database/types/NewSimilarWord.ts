import type {SimilarWord} from "@src/database/types/SimilarWord";

export interface NewSimilarWord extends SimilarWord {
  readonly userId: string;
  readonly now: Date;
}
