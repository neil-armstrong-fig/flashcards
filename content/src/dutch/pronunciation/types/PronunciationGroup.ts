import type {PronouncedWord} from "@flashcards/content/dutch/pronunciation/types/PronouncedWord";

/** The words that show one spelling pattern, and the pattern in a sentence or two, shown with each answer. */
export interface PronunciationGroup {
  readonly rule: string;
  readonly explanation: string;
  readonly words: readonly PronouncedWord[];
}
