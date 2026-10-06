import {nextStepAfter} from "@src/azure/answer/NextStepAfter";

it("uses a success", () => {
  expect(nextStepAfter({status: 200, attempt: 1})).toEqual({kind: "use"});
});

it("waits for as long as a 429 says, and asks again", () => {
  expect(nextStepAfter({status: 429, retryAfter: "7", attempt: 1})).toEqual({kind: "wait", ms: 7_000});
});

it("waits thirty seconds when a 429 says nothing useful", () => {
  expect(nextStepAfter({status: 429, attempt: 1})).toEqual({kind: "wait", ms: 30_000});
  expect(nextStepAfter({status: 429, retryAfter: "soon", attempt: 1})).toEqual({kind: "wait", ms: 30_000});
});

it("stops on any other refusal", () => {
  expect(nextStepAfter({status: 401, attempt: 1})).toEqual({kind: "stop"});
});

it("stops when it is still being told to wait after the fifth try", () => {
  expect(nextStepAfter({status: 429, retryAfter: "7", attempt: 4})).toEqual({kind: "wait", ms: 7_000});
  expect(nextStepAfter({status: 429, retryAfter: "7", attempt: 5})).toEqual({kind: "stop"});
});
