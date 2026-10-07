interface Props {
  readonly label: string;
  /** A line under the label saying what turning it on does. */
  readonly description: string;
  readonly testId: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
}

/** A setting that is on or off. */
export function ToggleSetting({label, description, testId, checked, onChange}: Props): React.JSX.Element {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl bg-ground-raised p-4">
      <span className="flex flex-col gap-1">
        {label}

        <span className="text-sm text-ink-muted">{description}</span>
      </span>

      <input
        type="checkbox"
        data-testid={testId}
        checked={checked}
        onChange={event => onChange(event.currentTarget.checked)}
        className="size-6 accent-accent"
      />
    </label>
  );
}
