import {KVNamespace} from "alchemy/cloudflare";

/** The month's count of characters sent to Azure, one key a month: the spend guard's memory. Adopted by name where it exists. */
export async function buildSpeechBudget(): Promise<KVNamespace> {
  return await KVNamespace("speech-budget", {title: "flashcards-speech-budget", adopt: true});
}
