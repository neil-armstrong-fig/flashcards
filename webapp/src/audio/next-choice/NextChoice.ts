/** The choice after `current` in the list, wrapping round to the first. With two choices, the other one. */
export function nextChoice<Choice>(choices: readonly Choice[], current: Choice): Choice | undefined {
  const index = choices.indexOf(current);

  return choices[(index + 1) % choices.length];
}
