/** The SHA-256 of a picture's bytes, in lower-case hexadecimal: the name it is kept under online, so the same picture is one object however often it is sent. */
export async function hashOfPicture(picture: Blob): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", await picture.arrayBuffer()));

  return Array.from(digest, byte => byte.toString(16).padStart(2, "0")).join("");
}
