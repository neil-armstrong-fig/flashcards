import {missingJobs} from "@src/generate/MissingJobs";
import type {RecordingJob} from "@src/plan/types/RecordingJob";

function jobFor(file: string): RecordingJob {
  return {
    language: "ko",
    text: "물",
    variant: "female-normal",
    voiceName: "ko-KR-JiMinNeural",
    locale: "ko-KR",
    rate: "default",
    file,
  };
}

it("keeps the jobs whose file is not kept yet, in order", () => {
  const jobs = [jobFor("a.mp3"), jobFor("b.mp3"), jobFor("c.mp3")];

  expect(missingJobs(jobs, new Set(["b.mp3"])).map(job => job.file)).toEqual(["a.mp3", "c.mp3"]);
});

it("keeps none when every file is kept", () => {
  expect(missingJobs([jobFor("a.mp3")], new Set(["a.mp3"]))).toEqual([]);
});
