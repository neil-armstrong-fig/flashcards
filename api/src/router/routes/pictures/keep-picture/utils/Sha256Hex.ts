/** The SHA-256 of some bytes, in lower-case hexadecimal. */
export async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));

  return Array.from(digest, byte => byte.toString(16).padStart(2, "0")).join("");
}
