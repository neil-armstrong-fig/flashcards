import {Link} from "react-router";

interface Props {
  readonly to: string;
  readonly testId: string;
  /** Where it goes, for a screen reader: "Back to the settings". */
  readonly label: string;
}

/** The back button at the top of a screen: a full-height tap target, kept to the left edge without a negative margin. */
export function BackLink({to, testId, label}: Props): React.JSX.Element {
  return (
    <Link
      to={to}
      data-testid={testId}
      aria-label={label}
      className="relative flex min-h-11 items-center self-start text-lg text-ink-muted after:absolute after:-inset-x-2 after:inset-y-0 after:content-['']"
    >
      <span aria-hidden="true">←</span>

      <span className="ml-2">Back</span>
    </Link>
  );
}
