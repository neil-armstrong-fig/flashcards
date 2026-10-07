/** How long a tap's buzz is: short, so it reads as a tick and not an alert. */
const TICK_MILLISECONDS = 15;

/**
 * Buzzes the phone for a moment (a tick, unless told otherwise), so a tap is felt as well as seen. Where the device has no
 * vibration motor (an iPhone's browser, a laptop) nothing happens. Never throws.
 */
export function buzz(milliseconds: number = TICK_MILLISECONDS): void {
  try {
    navigator.vibrate?.(milliseconds);
  } catch (error) {
    console.error("The phone could not be buzzed.", error);
  }
}
