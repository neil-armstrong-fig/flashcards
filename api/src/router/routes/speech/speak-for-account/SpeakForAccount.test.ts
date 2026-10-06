import {speakForAccount} from "@src/router/routes/speech/speak-for-account/SpeakForAccount";
import {speechCacheKey} from "@src/speech/cache/SpeechCacheKey";
import {testKvNamespace} from "@src/testing/kv/TestKvNamespace";
import {workerEnvironment} from "@src/env/WorkerEnvironment";

const VALID = {language: "ko", text: "불", voice: "female", speed: "normal"} as const;
const BUDGET_KEY = "characters:2026-10";

interface World {
  /** What was sent to Azure. */
  readonly sent: Request[];
}

/** The Worker's bindings, an allowed caller and an Azure that makes two bytes of audio, until the test changes any of it. */
function world(azure: () => Response = () => new Response(new Uint8Array([7, 7]))): World {
  const sent: Request[] = [];

  workerEnvironment.SPEECH_AUDIO = testKvNamespace();
  workerEnvironment.SPEECH_BUDGET = testKvNamespace();
  workerEnvironment.SPEECH_LIMITER = {limit: async () => ({success: true})};
  workerEnvironment.AZURE_SPEECH_REGION = "uksouth";
  workerEnvironment.AZURE_SPEECH_KEY = "not-a-real-key";
  vi.stubGlobal("fetch", async (input: string | Request, init?: RequestInit) => {
    sent.push(new Request(input, init));

    return azure();
  });

  return {sent};
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();

  for (const name of [
    "SPEECH_AUDIO",
    "SPEECH_BUDGET",
    "SPEECH_LIMITER",
    "AZURE_SPEECH_REGION",
    "AZURE_SPEECH_KEY",
    "MONTHLY_CHARACTER_CEILING",
  ]) {
    Reflect.deleteProperty(workerEnvironment, name);
  }
});

function post(body: unknown): Request {
  return new Request("https://api.example/api/speech", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body),
  });
}

async function bytesOf(response: Response): Promise<number[]> {
  return [...new Uint8Array(await response.arrayBuffer())];
}

it("makes a recording it has not got, hands it back as audio, and keeps it", async () => {
  const {sent} = world();

  const response = await speakForAccount(post(VALID));

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
  expect(response.headers.get("X-Speech-Cache")).toBe("miss");
  expect(await bytesOf(response)).toEqual([7, 7]);
  expect(sent).toHaveLength(1);
  expect(await sent[0]?.text()).toContain("ko-KR-");
  expect(await workerEnvironment.SPEECH_BUDGET.get(BUDGET_KEY)).toBe("1");
  expect(await workerEnvironment.SPEECH_AUDIO.get(speechCacheKey(VALID), "arrayBuffer")).not.toBeNull();
});

it("hands back a recording it already has without calling Azure or spending anything, however often it is asked", async () => {
  const {sent} = world();

  await speakForAccount(post(VALID));
  const again = await speakForAccount(post(VALID));

  expect(again.headers.get("X-Speech-Cache")).toBe("hit");
  expect(await bytesOf(again)).toEqual([7, 7]);
  expect(sent).toHaveLength(1);
  expect(await workerEnvironment.SPEECH_BUDGET.get(BUDGET_KEY)).toBe("1");
});

it("keeps each voice and speed of a word apart, so each is made once", async () => {
  const {sent} = world();

  await speakForAccount(post(VALID));
  await speakForAccount(post({...VALID, voice: "male"}));
  await speakForAccount(post({...VALID, speed: "slower"}));

  expect(sent).toHaveLength(3);
});

it("serves a recording already made even to a caller over their allowance, and an exhausted budget", async () => {
  world();
  await speakForAccount(post(VALID));
  workerEnvironment.SPEECH_LIMITER = {limit: async () => ({success: false})};
  await workerEnvironment.SPEECH_BUDGET.put(BUDGET_KEY, "100000");

  const response = await speakForAccount(post(VALID));

  expect(response.status).toBe(200);
});

it.each([
  ["English", {...VALID, text: "water"}],
  ["no body at all", undefined],
])("refuses %s, and spends nothing", async (_name, body) => {
  const {sent} = world();

  const response = await speakForAccount(post(body));

  expect(response.status).toBe(400);
  expect(sent).toEqual([]);
  expect(await workerEnvironment.SPEECH_BUDGET.get(BUDGET_KEY)).toBeNull();
});

it("refuses a caller over their allowance, before the budget is touched", async () => {
  world();
  workerEnvironment.SPEECH_LIMITER = {limit: async () => ({success: false})};

  const response = await speakForAccount(post(VALID));

  expect(response.status).toBe(429);
  expect(await workerEnvironment.SPEECH_BUDGET.get(BUDGET_KEY)).toBeNull();
});

it("refuses when the month's budget is used up, and never calls Azure", async () => {
  const {sent} = world();
  await workerEnvironment.SPEECH_BUDGET.put(BUDGET_KEY, "100000");

  const response = await speakForAccount(post(VALID));

  expect(response.status).toBe(503);
  expect(sent).toEqual([]);
});

it("says only that the service could not make it when Azure refuses, and keeps nothing", async () => {
  world(() => new Response("secret detail", {status: 401}));
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  const response = await speakForAccount(post(VALID));

  expect(response.status).toBe(502);
  expect(await response.text()).not.toContain("secret");
  expect(await workerEnvironment.SPEECH_AUDIO.get(speechCacheKey(VALID), "arrayBuffer")).toBeNull();
});
