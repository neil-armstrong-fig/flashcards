/** An IndexedDB request as a promise of what it found. */
export function requestResult<Result>(request: IDBRequest): Promise<Result> {
  return new Promise((resolve, reject) => {
    request.onsuccess = (): void => resolve(request.result as Result);
    request.onerror = (): void => reject(request.error);
  });
}
