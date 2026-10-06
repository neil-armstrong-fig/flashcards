import {ceilingOf} from "@src/speech/budget/CeilingOf";
import {clientOf} from "@src/router/sign-in/shared/utils/ClientOf";
import {keepSpeech} from "@src/speech/cache/KeepSpeech";
import {readCachedSpeech} from "@src/speech/cache/ReadCachedSpeech";
import {reserveCharacters} from "@src/speech/budget/ReserveCharacters";
import {speechCacheKey} from "@src/speech/cache/SpeechCacheKey";
import {speechRequestFrom} from "@src/router/routes/speech/speak-for-account/utils/SpeechRequestFrom";
import {synthesiseSpeech} from "@src/speech/azure/SynthesiseSpeech";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

type CacheStatus = "hit" | "miss";

/**
 * `POST /api/speech` with `{language, text, voice, speed}`: a recording of some Korean (or, for `en`, an English meaning), as MP3, for a signed-in person on an allowed origin
 * (the router has already checked both). Each refusal is a status of its own and says nothing about Azure. In order: the body must
 * check out; then a recording already made is simply handed back, costing nothing and counting against nothing, which is what
 * makes a repeated word free; then the caller must be inside their minute's allowance, and the month's character budget must
 * have room. What Azure makes is kept before it is handed back. The bindings are read here, at the point of use.
 */
export async function speakForAccount(request: Request): Promise<Response> {
  const speech = speechRequestFrom(await readJson(request));

  if (!speech) {
    return new Response("Ask for some Korean, a voice and a speed.", {status: 400});
  }

  const key = speechCacheKey(speech);
  const kept = await readCachedSpeech(key);

  if (kept !== undefined) {
    return audioResponse(kept, "hit");
  }

  if (!(await workerEnvironment.SPEECH_LIMITER.limit({key: clientOf(request)})).success) {
    return new Response("Too many requests: wait a minute.", {status: 429});
  }

  const reserved = await reserveCharacters(workerEnvironment.SPEECH_BUDGET, {
    characters: speech.text.length,
    ceiling: ceilingOf(workerEnvironment.MONTHLY_CHARACTER_CEILING),
    now: new Date(),
  });

  if (!reserved) {
    return new Response("The month's speech allowance is used up.", {status: 503});
  }

  const made = await synthesiseSpeech(
    {region: workerEnvironment.AZURE_SPEECH_REGION, key: workerEnvironment.AZURE_SPEECH_KEY},
    speech,
  );

  if (!made.ok) {
    console.error(`Azure answered ${made.status}.`);

    return new Response("The speech service could not make that.", {status: 502});
  }

  const audio = await made.arrayBuffer();

  await keepSpeech(key, audio);

  return audioResponse(audio, "miss");
}

function audioResponse(audio: ArrayBuffer, cache: CacheStatus): Response {
  return new Response(audio, {status: 200, headers: {"Content-Type": "audio/mpeg", "X-Speech-Cache": cache}});
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}
