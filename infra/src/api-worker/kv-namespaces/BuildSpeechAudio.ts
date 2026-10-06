import {KVNamespace} from "alchemy/cloudflare";

/** Every recording Azure has made, kept so asking for the same word again costs nothing. Adopted by name where it exists. */
export async function buildSpeechAudio(): Promise<KVNamespace> {
  return await KVNamespace("speech-audio", {title: "flashcards-speech-audio", adopt: true});
}
