import type {Note} from "@src/database/types/Note";

export interface NewNote extends Note {
  readonly userId: string;
  readonly now: Date;
}
