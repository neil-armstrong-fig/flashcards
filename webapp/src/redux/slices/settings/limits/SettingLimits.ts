import type {NumberLimits} from "@src/redux/slices/settings/limits/NumberLimits";

export const NEW_CARDS_PER_DAY_LIMITS: NumberLimits = {min: 0, max: 999};

export const MAX_REVIEWS_PER_DAY_LIMITS: NumberLimits = {min: 0, max: 9999};

export const STRUGGLING_AFTER_LIMITS: NumberLimits = {min: 1, max: 99};

/** What the Free Spaced Repetition Scheduler can sensibly aim for: below 70 percent the reviews stop paying off, and above 97 the number of reviews climbs steeply. */
export const DESIRED_RETENTION_PERCENT_LIMITS: NumberLimits = {min: 70, max: 97};

/** The hours of a day, as a clock reads them. */
export const REMINDER_HOUR_LIMITS: NumberLimits = {min: 0, max: 23};

export const DAILY_GOAL_CARDS_LIMITS: NumberLimits = {min: 1, max: 999};
