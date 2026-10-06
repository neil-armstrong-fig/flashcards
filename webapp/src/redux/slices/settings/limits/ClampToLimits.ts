import type {NumberLimits} from "@src/redux/slices/settings/limits/NumberLimits";

/** The whole number nearest `value` that is within the limits. */
export function clampToLimits(value: number, limits: NumberLimits): number {
  return Math.min(limits.max, Math.max(limits.min, Math.round(value)));
}
