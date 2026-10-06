const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** A wait as a rating button says it: `1m`, `10m`, `3h`, `15d`, `1.5mo`, `2y`. Under a minute rounds up to one. */
export function formatInterval(milliseconds: number): string {
  if (milliseconds < HOUR) {
    return `${Math.max(1, Math.round(milliseconds / MINUTE))}m`;
  }

  if (milliseconds < DAY) {
    return `${Math.round(milliseconds / HOUR)}h`;
  }

  const days = milliseconds / DAY;

  if (days < 30) {
    return `${Math.round(days)}d`;
  }

  if (days < 365) {
    return `${oneDecimal(days / 30)}mo`;
  }

  return `${oneDecimal(days / 365)}y`;
}

/** One decimal place, dropped when it is a whole number: `1.5`, but `2`. */
function oneDecimal(value: number): string {
  return String(Math.round(value * 10) / 10);
}
