import {generateAudio} from "@src/generate/GenerateAudio";
import {runtime} from "@src/runtime/Runtime";
import {SHIPPED_DECKS} from "@language-learning/content/decks/ShippedDecks";

/**
 * `pnpm --filter @language-learning/tools generate-audio`. The key and region come from `.env.dev` (names only, in
 * `.env.example`) and are never printed.
 */
async function main(): Promise<void> {
  const key = process.env["AZURE_SPEECH_KEY"];
  const region = process.env["AZURE_SPEECH_REGION"];

  if (!key || !region) {
    throw new Error("AZURE_SPEECH_KEY and AZURE_SPEECH_REGION must be set (see .env.example).");
  }

  runtime.key = key;
  runtime.region = region;

  const summary = await generateAudio(SHIPPED_DECKS);

  console.warn(`Done: ${summary.made} made of ${summary.needed} needed, ${summary.characters} characters sent.`);
}

await main();
