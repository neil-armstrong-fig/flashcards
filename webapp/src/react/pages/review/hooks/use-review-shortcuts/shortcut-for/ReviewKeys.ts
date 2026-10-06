import type {AsideKind} from "@src/redux/slices/study/types/AsideKind";
import type {Rating} from "@language-learning/shared/study/Rating";

/** The keys of the review screen. Each key names what it does, so a key and its meaning cannot drift apart. */
export const REVIEW_KEYS = {
  /** Show the answer, then rate good (or, in a look ahead, move on). */
  advance: [" ", "Enter"],
  setAside: {"-": "bury", "@": "suspend"} as const satisfies Readonly<Record<string, AsideKind>>,
  rate: {"1": "again", "2": "hard", "3": "good", "4": "easy"} as const satisfies Readonly<Record<string, Rating>>,
} as const;
