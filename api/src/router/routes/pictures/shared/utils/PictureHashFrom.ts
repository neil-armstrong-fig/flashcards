const PICTURES_PREFIX = "/api/pictures/";
const HASH = /^[0-9a-f]{64}$/;

/** The hash a picture is asked for by: the last part of the path, which must be a SHA-256 in lower-case hexadecimal. `undefined` for any other name. */
export function pictureHashFrom(pathname: string): string | undefined {
  const name = pathname.slice(PICTURES_PREFIX.length);

  if (!pathname.startsWith(PICTURES_PREFIX) || !HASH.test(name)) {
    return undefined;
  }

  return name;
}
