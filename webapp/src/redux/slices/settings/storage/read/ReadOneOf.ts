/** A stored value that is one of the listed items, or `undefined` if it is anything else. */
export function readOneOf<Item extends string>(value: unknown, items: readonly Item[]): Item | undefined {
  return items.find(item => item === value);
}
