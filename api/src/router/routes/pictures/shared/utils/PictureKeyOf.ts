/** Where an account's picture sits in the bucket: under the account, so one account can never reach another's, even by guessing a hash. */
export function pictureKeyOf(accountId: string, hash: string): string {
  return `${accountId}/${hash}`;
}
