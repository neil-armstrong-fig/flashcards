import {manifestOf} from "@src/manifest/ManifestOf";
import type {RecordingJob} from "@src/plan/types/RecordingJob";

function job(text: string, variant: RecordingJob["variant"]): RecordingJob {
  return {
    language: "ko",
    text,
    variant,
    voiceName: "ko-KR-JiMinNeural",
    locale: "ko-KR",
    rate: "default",
    file: `ko/${variant}/${text}.mp3`,
  };
}

it("groups the recordings of a text under its language", () => {
  const jobs = [job("물", "female-normal"), job("물", "male-slower"), job("밥", "female-normal")];

  expect(manifestOf(jobs, () => true)).toEqual({
    ko: {
      물: {"female-normal": "ko/female-normal/물.mp3", "male-slower": "ko/male-slower/물.mp3"},
      밥: {"female-normal": "ko/female-normal/밥.mp3"},
    },
  });
});

it("names only the recordings that exist", () => {
  const jobs = [job("물", "female-normal"), job("물", "male-slower")];

  expect(manifestOf(jobs, file => file.includes("female"))).toEqual({
    ko: {물: {"female-normal": "ko/female-normal/물.mp3"}},
  });
});

it("leaves out a text none of whose recordings exist", () => {
  expect(manifestOf([job("물", "female-normal")], () => false)).toEqual({});
});
