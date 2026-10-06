import {nextChoice} from "@src/audio/next-choice/NextChoice";
import {useAppDispatch} from "@src/redux/shared/Hooks";
import {useAudioChoices} from "@src/react/audio/hooks/use-audio-choices/UseAudioChoices";
import {VOICES} from "@language-learning/shared/audio/Voice";
import {voiceChosen} from "@src/redux/slices/settings/SettingsSlice";
import type {AudioChoices} from "@src/audio/types/AudioChoices";

/** Switches between the female and male voice, keeps the choice, and says again, in the new voice, whatever `replay` says (nothing, if it is not given), so the two can be compared. */
export function useSwitchVoice(replay?: (choices: AudioChoices) => void): () => void {
  const dispatch = useAppDispatch();
  const choices = useAudioChoices();

  return (): void => {
    const next = nextChoice(VOICES, choices.voice);

    if (next === undefined) {
      return;
    }

    dispatch(voiceChosen(next));
    replay?.({...choices, voice: next});
  };
}
