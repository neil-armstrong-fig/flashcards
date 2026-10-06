import type {NumberLimits} from "@src/redux/slices/settings/limits/NumberLimits";

/** A stored number that is a whole number within the limits, or `undefined` if it is anything else. */
export function readLimitedInteger(value: unknown, limits: NumberLimits): number | undefined {
  if (typeof value !== "number" || !Number.isInteger(value) || value < limits.min || value > limits.max) {
    return undefined;
  }

  return value;
}
