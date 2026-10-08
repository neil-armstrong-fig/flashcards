/** A text cut around the part to show in bold; `bold` is empty where the text has none. */
export interface TextAroundEmphasis {
  readonly before: string;
  readonly bold: string;
  readonly after: string;
}

/** `text` cut at the first place `emphasis` appears in it, or whole and unemphasised when there is none or it is not found. */
export function splitAtEmphasis(text: string, emphasis: string | undefined): TextAroundEmphasis {
  const start = emphasis === undefined || emphasis === "" ? -1 : text.indexOf(emphasis);

  if (emphasis === undefined || start === -1) {
    return {before: text, bold: "", after: ""};
  }

  return {before: text.slice(0, start), bold: emphasis, after: text.slice(start + emphasis.length)};
}
