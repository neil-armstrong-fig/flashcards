interface Props {
  readonly className: string;
}

/** A rabbit in profile, for normal speed, drawn in the text colour. Decorative: whatever holds it carries the label. */
export function RabbitIcon({className}: Props): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="11" cy="16" rx="7" ry="4.5" />

        <circle cx="18" cy="11.5" r="3" />

        <ellipse cx="16.8" cy="5" rx="1.3" ry="3.2" />

        <ellipse cx="20" cy="5.4" rx="1.3" ry="3" />

        <circle cx="3.6" cy="15.5" r="1.4" />
      </g>

      <circle cx="19" cy="11" r=".8" fill="currentColor" />
    </svg>
  );
}
