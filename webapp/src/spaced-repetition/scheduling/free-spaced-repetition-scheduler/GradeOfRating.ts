import {Rating as FreeSpacedRepetitionSchedulerRating} from "ts-fsrs";
import type {Grade} from "ts-fsrs";
import type {Rating} from "@flashcards/shared/study/Rating";

const GRADE_OF_RATING: Record<Rating, Grade> = {
  again: FreeSpacedRepetitionSchedulerRating.Again,
  hard: FreeSpacedRepetitionSchedulerRating.Hard,
  good: FreeSpacedRepetitionSchedulerRating.Good,
  easy: FreeSpacedRepetitionSchedulerRating.Easy,
};

/** The library's grade for one of our ratings. */
export function gradeOfRating(rating: Rating): Grade {
  return GRADE_OF_RATING[rating];
}
