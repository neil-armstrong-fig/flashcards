/**
 * Whether the account signed in may sync with this device's progress: the one that first synced it, or any when none has. Another
 * account's events would otherwise be mixed into this one's cards, so it is left unsynced rather than merged.
 */
export function maySyncAs(owner: string | undefined, email: string): boolean {
  return owner === undefined || owner === email;
}
