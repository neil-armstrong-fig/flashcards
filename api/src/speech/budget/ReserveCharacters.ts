interface BudgetClaim {
  /** How many characters are about to be sent to Azure. */
  readonly characters: number;
  /** The most that may be sent in a month. */
  readonly ceiling: number;
  readonly now: Date;
}

/**
 * Counts the characters about to be sent to Azure against the month's ceiling, and says whether there is room. Azure's budgets
 * only email and the paid tier has no free allowance, so this is the guard that actually refuses (`docs/audio.md`). The count
 * is read and then written, not atomic, so two requests at once can both pass: it is a ceiling to be near, not exact. The count
 * is kept even when a request is refused before it, so a refused request is not charged.
 */
export async function reserveCharacters(store: KVNamespace, {characters, ceiling, now}: BudgetClaim): Promise<boolean> {
  const key = `characters:${now.toISOString().slice(0, 7)}`;
  const used = Number(await store.get(key)) || 0;

  if (used + characters > ceiling) {
    return false;
  }

  await store.put(key, String(used + characters));

  return true;
}
