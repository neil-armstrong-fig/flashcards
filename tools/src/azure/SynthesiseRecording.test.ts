import {runtime} from "@src/runtime/Runtime";
import {sleep} from "@src/runtime/Sleep";
import {synthesiseRecording} from "@src/azure/SynthesiseRecording";
import type {RecordingJob} from "@src/plan/types/RecordingJob";

vi.mock("@src/runtime/Sleep", () => ({sleep: vi.fn(async () => undefined)}));

const JOB: RecordingJob = {
  language: "ko",
  text: "물",
  variant: "female-normal",
  voiceName: "ko-KR-JiMinNeural",
  locale: "ko-KR",
  rate: "default",
  file: "ko/female-normal/abc.mp3",
};

function azureAnswering(answers: readonly Response[]): Request[] {
  const requests: Request[] = [];
  const remaining = [...answers];

  vi.stubGlobal("fetch", async (request: Request) => {
    requests.push(request);

    return remaining.shift() ?? new Response(null, {status: 500});
  });

  return requests;
}

beforeEach(() => {
  runtime.region = "uksouth";
  runtime.key = "not-a-real-key";
  runtime.requestIntervalMs = 0;
  runtime.lastRequestAt = undefined;
  vi.mocked(sleep).mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

it("asks Azure and returns the audio", async () => {
  const requests = azureAnswering([new Response(new Uint8Array([1, 2, 3]))]);

  const audio = await synthesiseRecording(JOB);

  expect([...audio]).toEqual([1, 2, 3]);
  expect(requests).toHaveLength(1);
});

it("waits and tries again after a 429, for as long as it was told", async () => {
  const requests = azureAnswering([
    new Response(null, {status: 429, headers: {"Retry-After": "7"}}),
    new Response(new Uint8Array([9])),
  ]);

  await synthesiseRecording(JOB);

  expect(requests).toHaveLength(2);
  expect(sleep).toHaveBeenCalledWith(7_000);
});

it("stops on any other refusal, naming the status and not the key", async () => {
  azureAnswering([new Response(null, {status: 401})]);

  const failure = await synthesiseRecording(JOB).catch((error: unknown) => error);

  expect(String(failure)).toContain("status 401");
  expect(String(failure)).not.toContain("not-a-real-key");
});

it("gives up when it is still being told to wait after five tries", async () => {
  const requests = azureAnswering(Array.from({length: 5}, () => new Response(null, {status: 429})));

  await expect(synthesiseRecording(JOB)).rejects.toThrow("status 429");
  expect(requests).toHaveLength(5);
});
