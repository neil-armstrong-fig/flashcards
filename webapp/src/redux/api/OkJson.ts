/** The answer's JSON (or `undefined` where it has none), after checking it was a success. What comes back is checked by the caller before it is believed. */
export async function okJson(response: Response): Promise<unknown> {
  if (!response.ok) {
    throw new Error(`The API answered ${response.status}.`);
  }

  if (response.status === 204) {
    return undefined;
  }

  return await response.json();
}
