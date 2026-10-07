/** Whether a choice made at `incoming` beats the one made at `current` (`undefined` for a setting never chosen). A tie keeps what is there. */
export function isLaterChoice(incoming: string, current: string | undefined): boolean {
  if (current === undefined) {
    return true;
  }

  return new Date(incoming).getTime() > new Date(current).getTime();
}
