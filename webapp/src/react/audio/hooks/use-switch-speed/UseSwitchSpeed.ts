import {nextChoice} from "@src/audio/next-choice/NextChoice";
import {speedChosen} from "@src/redux/slices/settings/SettingsSlice";
import {SPEEDS} from "@language-learning/shared/audio/Speed";
import {useAppDispatch} from "@src/redux/shared/Hooks";
import {useAudioChoices} from "@src/react/audio/hooks/use-audio-choices/UseAudioChoices";
import type {AudioChoices} from "@src/audio/types/AudioChoices";

/** Switches between normal and slower speed, keeps the choice, and says again, at the new speed, whatever `replay` says (nothing, if it is not given), so the two can be compared. */
export function useSwitchSpeed(replay?: (choices: AudioChoices) => void): () => void {
  const dispatch = useAppDispatch();
  const choices = useAudioChoices();

  return (): void => {
    const next = nextChoice(SPEEDS, choices.speed);

    if (next === undefined) {
      return;
    }

    dispatch(speedChosen(next));
    replay?.({...choices, speed: next});
  };
}
