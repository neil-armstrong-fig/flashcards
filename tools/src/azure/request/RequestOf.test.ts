import {requestOf} from "@src/azure/request/RequestOf";
import type {RecordingJob} from "@src/plan/types/RecordingJob";

const JOB: RecordingJob = {
  language: "ko",
  text: "물",
  variant: "female-normal",
  voiceName: "ko-KR-JiMinNeural",
  locale: "ko-KR",
  rate: "default",
  file: "ko/female-normal/abc.mp3",
};

it("posts the speech markup to the region's endpoint with the key", async () => {
  const request = requestOf(JOB, {region: "uksouth", key: "not-a-real-key"});

  expect(request.method).toBe("POST");
  expect(request.url).toBe("https://uksouth.tts.speech.microsoft.com/cognitiveservices/v1");
  expect(request.headers.get("Ocp-Apim-Subscription-Key")).toBe("not-a-real-key");
  expect(await request.text()).toContain("ko-KR-JiMinNeural");
});
