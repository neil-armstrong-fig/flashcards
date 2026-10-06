/** A three-digit hex colour written out in full (the stylesheet is minified to `#000`), so a spec compares like with like. */
export function fullHex(colour: string): string {
  if (!/^#[0-9a-f]{3}$/i.test(colour)) {
    return colour;
  }

  return `#${[...colour.slice(1)].map(digit => digit + digit).join("")}`;
}
