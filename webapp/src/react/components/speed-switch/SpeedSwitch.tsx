import clsx from "clsx";
import {RabbitIcon} from "@src/react/components/rabbit-icon/RabbitIcon";
import {TurtleIcon} from "@src/react/components/turtle-icon/TurtleIcon";
import {selectSpeechSpeed} from "@src/redux/shared/speech/SelectSpeechSpeed";
import {useAppSelector} from "@src/redux/shared/Hooks";
import {useSwitchSpeed} from "@src/react/audio/hooks/use-switch-speed/UseSwitchSpeed";
import type {AudioChoices} from "@src/audio/types/AudioChoices";
import type {Speed} from "@flashcards/shared/audio/Speed";

const SPEED_LABELS = {normal: "Normal speed", slower: "Slower"} as const satisfies Record<Speed, string>;

const CHOSEN = "bg-accent text-ground";

interface Props {
  readonly testId: string;
  readonly className: string;
  /** What is said again after the switch, if anything, at the speed just chosen. */
  readonly replay?: (choices: AudioChoices) => void;
}

/** Shows both speeds as a rabbit (normal) and a turtle (slower), with the chosen one filled. Pressing it switches to the other, which speaks again so the two can be compared. */
export function SpeedSwitch({testId, className, replay}: Props): React.JSX.Element {
  const speed = useAppSelector(selectSpeechSpeed);
  const switchSpeed = useSwitchSpeed(replay);

  return (
    <button
      type="button"
      data-testid={testId}
      aria-label={SPEED_LABELS[speed]}
      onClick={switchSpeed}
      className={clsx(className, "flex min-h-11 items-center justify-center gap-1")}
    >
      <span className={clsx("flex flex-1 justify-center rounded-full px-3 py-1", speed === "normal" && CHOSEN)}>
        <RabbitIcon className="size-6" />
      </span>

      <span className={clsx("flex flex-1 justify-center rounded-full px-3 py-1", speed === "slower" && CHOSEN)}>
        <TurtleIcon className="size-6" />
      </span>
    </button>
  );
}
