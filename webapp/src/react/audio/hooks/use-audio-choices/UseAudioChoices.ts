import {useMemo} from "react";
import {selectSpeechSpeed} from "@src/redux/shared/speech/SelectSpeechSpeed";
import {selectSpeechVoice} from "@src/redux/shared/speech/SelectSpeechVoice";
import {useAppSelector} from "@src/redux/shared/Hooks";
import type {AudioChoices} from "@src/audio/types/AudioChoices";

/** The voice and speed to speak in, as one value that changes only when they do: those of the deck being studied, else those for browsing. */
export function useAudioChoices(): AudioChoices {
  const voice = useAppSelector(selectSpeechVoice);
  const speed = useAppSelector(selectSpeechSpeed);

  return useMemo(() => ({voice, speed}), [voice, speed]);
}
