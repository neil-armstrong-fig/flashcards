/** The value of a request's header, or undefined where it has none: `Headers.get` answers `null`, which stays out of the rest of the API. */
export function headerOf(request: Request, name: string): string | undefined {
  return request.headers.get(name) ?? undefined;
}
