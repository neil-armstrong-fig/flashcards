import clsx from "clsx";
import {useRecordingsStarted} from "@src/react/audio/hooks/use-recordings-started/UseRecordingsStarted";
import {useAppSelector} from "@src/redux/shared/Hooks";

interface Props {
  /** What it washes over: the whole screen, or the nearest enclosing box that is `relative` (a card in a list). */
  readonly within: "screen" | "card";
  /** False to hold it back, where a list has many and only the one that was played should show. */
  readonly show?: boolean;
}

/**
 * A wash of the accent colour, rising from the bottom, each time a recording starts, so that it is plain sound is coming (the phone
 * may be on silent, or the word not yet heard). Keyed by the count so each start plays it afresh. It never takes a tap. Where motion
 * is turned down it is a short flash with no movement.
 */
export function AudioFill({within, show = true}: Props): React.JSX.Element | undefined {
  const started = useRecordingsStarted();
  const enabled = useAppSelector(state => state.settings.audioFillEnabled);

  if (!enabled || started === 0 || !show) {
    return undefined;
  }

  return (
    <div
      key={started}
      data-testid="audio-fill"
      data-plays={started}
      aria-hidden="true"
      className={clsx(
        "pointer-events-none bg-accent opacity-0 motion-safe:animate-audio-fill motion-reduce:animate-audio-flash",
        within === "screen" && "fixed inset-0 z-40",
        within === "card" && "absolute inset-0 z-10 rounded-xl",
      )}
    />
  );
}
