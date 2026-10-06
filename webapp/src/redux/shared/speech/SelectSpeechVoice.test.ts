import {createStore} from "@src/redux/Store";
import {selectSpeechSpeed} from "@src/redux/shared/speech/SelectSpeechSpeed";
import {selectSpeechVoice} from "@src/redux/shared/speech/SelectSpeechVoice";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {deckSpeedChosen, deckVoiceChosen, voiceChosen} from "@src/redux/slices/settings/SettingsSlice";

it("is the voice and speed chosen for browsing while no deck is being studied", () => {
  const store = createStore();

  store.dispatch(voiceChosen("female"));

  expect(selectSpeechVoice(store.getState())).toBe("female");
  expect(selectSpeechSpeed(store.getState())).toBe("normal");
});

it("is the voice and speed chosen for the deck being studied, whatever browsing has", async () => {
  const {store} = await openedStudyStore();

  store.dispatch(voiceChosen("female"));
  store.dispatch(deckVoiceChosen({deckId: "ko-starter", voice: "male"}));
  store.dispatch(deckSpeedChosen({deckId: "ko-starter", speed: "slower"}));

  expect(selectSpeechVoice(store.getState())).toBe("male");
  expect(selectSpeechSpeed(store.getState())).toBe("slower");
});
