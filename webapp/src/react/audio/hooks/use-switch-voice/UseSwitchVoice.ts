import {nextChoice} from "@src/audio/next-choice/NextChoice";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";
import {useAudioChoices} from "@src/react/audio/hooks/use-audio-choices/UseAudioChoices";
import {VOICES} from "@flashcards/shared/audio/Voice";
import {deckVoiceChosen, voiceChosen} from "@src/redux/slices/settings/SettingsSlice";
import type {AudioChoices} from "@src/audio/types/AudioChoices";

/** Switches between the female and male voice, keeps the choice for the deck being studied (or for browsing, outside a deck), and says again, in the new voice, whatever `replay` says (nothing, if it is not given), so the two can be compared. */
export function useSwitchVoice(replay?: (choices: AudioChoices) => void): () => void {
  const dispatch = useAppDispatch();
  const choices = useAudioChoices();
  const deckId = useAppSelector(state => state.study.session?.deckId);

  return (): void => {
    const next = nextChoice(VOICES, choices.voice);

    if (next === undefined) {
      return;
    }

    if (deckId === undefined) {
      dispatch(voiceChosen(next));
    } else {
      dispatch(deckVoiceChosen({deckId, voice: next}));
    }

    replay?.({...choices, voice: next});
  };
}
