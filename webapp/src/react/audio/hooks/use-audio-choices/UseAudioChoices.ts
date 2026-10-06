import {useMemo} from "react";
import {useAppSelector} from "@src/redux/shared/Hooks";
import type {AudioChoices} from "@src/audio/types/AudioChoices";

/** The voice and speed the learner chose, as one value that changes only when they do. */
export function useAudioChoices(): AudioChoices {
  const voice = useAppSelector(state => state.settings.voice);
  const speed = useAppSelector(state => state.settings.speed);

  return useMemo(() => ({voice, speed}), [voice, speed]);
}
