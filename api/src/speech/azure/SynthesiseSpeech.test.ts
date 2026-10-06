import {synthesiseSpeech} from "@src/speech/azure/SynthesiseSpeech";

function recordingFetch(): Request[] {
  const requests: Request[] = [];

  vi.stubGlobal("fetch", async (input: string | Request, init?: RequestInit) => {
    requests.push(new Request(input, init));

    return new Response(new Uint8Array([1]));
  });

  return requests;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("posts the word to the region's endpoint with the key", async () => {
  const requests = recordingFetch();

  await synthesiseSpeech({region: "uksouth", key: "k"}, {language: "ko", text: "불", voice: "male", speed: "normal"});

  expect(requests[0]?.url).toBe("https://uksouth.tts.speech.microsoft.com/cognitiveservices/v1");
  expect(requests[0]?.headers.get("Ocp-Apim-Subscription-Key")).toBe("k");
  expect(await requests[0]?.text()).toContain("ko-KR-BongJinNeural");
});

it("asks for the slower rate only when slower", async () => {
  const requests = recordingFetch();

  await synthesiseSpeech({region: "uksouth", key: "k"}, {language: "ko", text: "불", voice: "female", speed: "slower"});

  expect(await requests[0]?.text()).toContain('<prosody rate="-15%">불</prosody>');
});

it("says an English meaning in the English voice, at normal speed", async () => {
  const requests = recordingFetch();

  await synthesiseSpeech(
    {region: "uksouth", key: "k"},
    {language: "en", text: "elephant", voice: "female", speed: "normal"},
  );

  const body = await requests[0]?.text();

  expect(body).toContain("en-GB-SoniaNeural");
  expect(body).toContain("elephant");
  expect(body).not.toContain("prosody");
});
