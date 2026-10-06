import type {MouseEvent} from "react";

const INTERACTIVE = "button, a, input, textarea, select, label, summary, dialog";

/**
 * Whether a click landed on plain screen: not on a button, link, field or dialog. A target already removed from the page (a button that
 * was pressed and replaced the card) is not a tap on the card either.
 */
export function isTapOnBackground(event: MouseEvent): boolean {
  if (!(event.target instanceof Element) || !event.currentTarget.contains(event.target)) {
    return false;
  }

  return !event.target.closest(INTERACTIVE);
}
