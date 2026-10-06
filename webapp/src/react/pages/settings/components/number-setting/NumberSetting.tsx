interface Props {
  readonly label: string;
  readonly testId: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly onChange: (value: number) => void;
}

/**
 * A whole-number setting. The field is the learner's to type in, so it is not re-rendered from the store on every key: a
 * half-typed or empty field is left alone, and only a number is passed on. When they leave it, it shows the value that was kept.
 */
export function NumberSetting({label, testId, value, min, max, onChange}: Props): React.JSX.Element {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl bg-ground-raised p-4">
      <span>{label}</span>

      <input
        type="number"
        inputMode="numeric"
        data-testid={testId}
        defaultValue={value}
        min={min}
        max={max}
        onChange={event => {
          if (event.currentTarget.value !== "") {
            onChange(Number(event.currentTarget.value));
          }
        }}
        onBlur={event => {
          event.currentTarget.value = String(value);
        }}
        className="w-24 rounded-lg bg-ground px-3 py-2 text-right text-accent"
      />
    </label>
  );
}
