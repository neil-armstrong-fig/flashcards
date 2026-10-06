interface Props<Choice extends string> {
  readonly label: string;
  /** The choices, in the order they are offered. */
  readonly choices: readonly Choice[];
  /** What each choice is called on screen. */
  readonly labels: Readonly<Record<Choice, string>>;
  /** The test id is `<testIdPrefix>-<choice>`. */
  readonly testIdPrefix: string;
  readonly value: Choice;
  readonly onChange: (choice: Choice) => void;
}

/** One of a few named choices, as a row of radio buttons. */
export function ChoiceSetting<Choice extends string>({
  label,
  choices,
  labels,
  testIdPrefix,
  value,
  onChange,
}: Props<Choice>): React.JSX.Element {
  return (
    <fieldset className="flex flex-col gap-3 rounded-xl bg-ground-raised p-4">
      <legend className="sr-only">{label}</legend>

      <span aria-hidden="true">{label}</span>

      <div className="grid grid-cols-2 gap-2">
        {choices.map(choice => (
          <label key={choice} className="flex items-center gap-3 rounded-lg bg-ground px-3 py-3">
            <input
              type="radio"
              name={testIdPrefix}
              data-testid={`${testIdPrefix}-${choice}`}
              checked={choice === value}
              onChange={() => onChange(choice)}
              className="accent-accent"
            />

            {labels[choice]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
