interface Props {
  readonly className: string;
}

/** A turtle in profile, for slower speed, drawn in the text colour. Decorative: whatever holds it carries the label. */
export function TurtleIcon({className}: Props): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 16a8 7 0 0 1 16 0Z" />

        <path d="M9 16c0-3 1-5 3-7M15 16c0-3-1-5-3-7" />

        <path d="M20 14c1.5-1 2.8-.5 2.8.8S21.5 16 20 16" />

        <path d="M7 16v3M16 16v3" />
      </g>

      <circle cx="21.6" cy="13.8" r=".7" fill="currentColor" />
    </svg>
  );
}
