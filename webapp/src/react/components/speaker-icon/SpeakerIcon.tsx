import clsx from "clsx";
import {useIsPlaying} from "@src/react/audio/hooks/use-is-playing/UseIsPlaying";

interface Props {
  readonly className: string;
}

/**
 * A loudspeaker giving off sound, drawn in the text colour, which pulses while a recording is sounding. Decorative: whatever
 * holds it carries the label.
 */
export function SpeakerIcon({className}: Props): React.JSX.Element {
  const playing = useIsPlaying();

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={clsx(className, playing && "motion-safe:animate-pulse")}>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />

      <path
        d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
