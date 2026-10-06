import type {NextShortcut} from "@src/react/pages/review/hooks/use-review-shortcuts/types/NextShortcut";
import type {RateShortcut} from "@src/react/pages/review/hooks/use-review-shortcuts/types/RateShortcut";
import type {SetAsideShortcut} from "@src/react/pages/review/hooks/use-review-shortcuts/types/SetAsideShortcut";
import type {ShowAnswerShortcut} from "@src/react/pages/review/hooks/use-review-shortcuts/types/ShowAnswerShortcut";

/** What a key press on the review screen asks for. */
export type ReviewShortcut = ShowAnswerShortcut | RateShortcut | SetAsideShortcut | NextShortcut;
