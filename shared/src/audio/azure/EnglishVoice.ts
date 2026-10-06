import type {AzureVoice} from "@flashcards/shared/audio/azure/AzureVoice";

/**
 * The one English voice, for the meaning on a card. English is not practised by listening, so there is one voice at normal
 * speed. British, as the app's copy is. Chosen without a listening test: change it here and run the generator again, and the
 * new voice's name makes new files.
 */
export const ENGLISH_VOICE: AzureVoice = {name: "en-GB-SoniaNeural", locale: "en-GB"};
