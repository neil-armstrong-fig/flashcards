/** The value of a query parameter, or undefined where there is none: `URLSearchParams.get` answers `null`, which stays out of the rest of the API. */
export function parameterOf(parameters: URLSearchParams, name: string): string | undefined {
  return parameters.get(name) ?? undefined;
}
