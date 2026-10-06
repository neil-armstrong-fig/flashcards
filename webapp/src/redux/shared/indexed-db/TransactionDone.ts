/** An IndexedDB transaction as a promise that settles once everything in it is written, or none of it is. */
export function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = (): void => resolve();
    transaction.onerror = (): void => reject(transaction.error);
    transaction.onabort = (): void => reject(transaction.error);
  });
}
