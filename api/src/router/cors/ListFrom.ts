/** The items of a comma-separated setting, trimmed, with the gaps dropped. */
export function listFrom(setting: string | undefined): string[] {
  return (setting ?? "")
    .split(",")
    .map(item => item.trim())
    .filter(item => item.length > 0);
}
