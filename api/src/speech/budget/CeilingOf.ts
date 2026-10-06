/** A fifth of Azure's free 500,000 characters a month. */
export const DEFAULT_MONTHLY_CHARACTER_CEILING = 100_000;

/** The monthly ceiling the Worker is configured with, or the default when it is unset or not a positive whole number. */
export function ceilingOf(setting: string | undefined): number {
  const ceiling = Number(setting);

  if (!Number.isInteger(ceiling) || ceiling <= 0) {
    return DEFAULT_MONTHLY_CHARACTER_CEILING;
  }

  return ceiling;
}
