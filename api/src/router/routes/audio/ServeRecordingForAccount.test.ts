import {afterEach, beforeEach} from "vitest";
import {api, SITE_ORIGIN} from "@src/testing/ApiHarness";
import {workerEnvironment} from "@src/env/WorkerEnvironment";
import type {RecordingsBucket} from "@src/buckets/recordings/types/RecordingsBucket";

const NAME = "ko/female-normal/c2f16032c0b9c1ea.mp3";
const BYTES = new Uint8Array([10, 11, 12, 13]);

/** A bucket holding one four-byte recording. */
const bucket: RecordingsBucket = {
  get: async key => {
    if (key !== NAME) {
      return null;
    }

    return {body: new Response(BYTES).body ?? new ReadableStream(), size: BYTES.length};
  },
};

beforeEach(() => {
  workerEnvironment.RECORDINGS = bucket;
});

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "RECORDINGS");
});

it("serves a recording to a signed-in account", async () => {
  const cookie = await api.signIn();
  const response = await api.send(`/api/audio/${NAME}`, {cookie});

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(BYTES);
});

it("gives nothing to anyone who is not signed in, and not even the fact that the recording exists", async () => {
  expect((await api.send(`/api/audio/${NAME}`)).status).toBe(401);
  expect((await api.send("/api/audio/ko/female-normal/0000000000000000.mp3")).status).toBe(401);
});

it("lets the site read it with the session cookie, and no other site", async () => {
  const cookie = await api.signIn();
  const fromSite = await api.send(`/api/audio/${NAME}`, {cookie});
  const fromElsewhere = await api.send(`/api/audio/${NAME}`, {cookie, origin: "https://evil.example"});

  expect(fromSite.headers.get("Access-Control-Allow-Origin")).toBe(SITE_ORIGIN);
  expect(fromSite.headers.get("Access-Control-Allow-Credentials")).toBe("true");
  expect(fromElsewhere.headers.get("Access-Control-Allow-Origin")).toBeNull();
});

it("answers 404 for a recording that is not there, and for a name the app never makes", async () => {
  const cookie = await api.signIn();

  expect((await api.send("/api/audio/ko/female-normal/0000000000000000.mp3", {cookie})).status).toBe(404);
  expect((await api.send("/api/audio/ko/female-normal/../../../secret", {cookie})).status).toBe(404);
  expect((await api.send("/api/audio/", {cookie})).status).toBe(404);
});
