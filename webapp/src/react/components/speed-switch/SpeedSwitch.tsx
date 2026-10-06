import {useAppSelector} from "@src/redux/shared/Hooks";
import {useSwitchSpeed} from "@src/react/audio/hooks/use-switch-speed/UseSwitchSpeed";
import type {AudioChoices} from "@src/audio/types/AudioChoices";
import type {Speed} from "@language-learning/shared/audio/Speed";

const SPEED_LABELS = {normal: "Normal speed", slower: "Slower"} as const satisfies Record<Speed, string>;

interface Props {
  readonly testId: string;
  readonly className: string;
  /** What is said again after the switch, if anything, at the speed just chosen. */
  readonly replay?: (choices: AudioChoices) => void;
}

/** Says which speed is chosen and switches to the other, which speaks again so the two can be compared. */
export function SpeedSwitch({testId, className, replay}: Props): React.JSX.Element {
  const speed = useAppSelector(state => state.settings.speed);
  const switchSpeed = useSwitchSpeed(replay);

  return (
    <button type="button" data-testid={testId} onClick={switchSpeed} className={className}>
      {SPEED_LABELS[speed]}
    </button>
  );
}
