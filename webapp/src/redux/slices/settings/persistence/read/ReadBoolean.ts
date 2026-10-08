/** A stored value that is a boolean, or `undefined` if it is anything else. */
export function readBoolean(value: unknown): boolean | undefined {
  if (typeof value !== "boolean") {
    return undefined;
  }

  return value;
}
