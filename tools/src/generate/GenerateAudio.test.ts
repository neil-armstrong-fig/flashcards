import {mkdtemp, readdir, readFile, rm} from "node:fs/promises";
import {tmpdir} from "node:os";
import {generateAudio} from "@src/generate/GenerateAudio";
import {runtime} from "@src/runtime/Runtime";
import type {AudioManifest} from "@language-learning/content/audio/types/AudioManifest";
import type {Deck} from "@language-learning/content/types/Deck";

vi.mock("@src/runtime/Sleep", () => ({sleep: vi.fn(async () => undefined)}));

const DECK: Deck = {
  id: "ko-test",
  name: "Test",
  language: "ko",
  notes: [{id: "ko-vocab-water", language: "ko", word: "물", meaning: "water", romanisation: "mul"}],
};

let scratch = "";
let requested = 0;

beforeEach(async () => {
  scratch = await mkdtemp(`${tmpdir()}/generate-audio-`);
  runtime.audioFolder = `${scratch}/audio/`;
  runtime.manifestFile = `${scratch}/recordings.json`;
  runtime.region = "uksouth";
  runtime.key = "not-a-real-key";
  runtime.requestIntervalMs = 0;
  runtime.lastRequestAt = undefined;
  requested = 0;
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  azureMakes({failOnRequest: undefined});
});

afterEach(async () => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  await rm(scratch, {recursive: true, force: true});
});

function azureMakes({failOnRequest}: {readonly failOnRequest: number | undefined}): void {
  vi.stubGlobal("fetch", async () => {
    requested += 1;

    if (requested === failOnRequest) {
      return new Response(null, {status: 401});
    }

    return new Response(new Uint8Array([1]));
  });
}

async function manifestWritten(): Promise<AudioManifest> {
  return JSON.parse(await readFile(runtime.manifestFile, "utf8")) as AudioManifest;
}

async function filesKept(): Promise<string[]> {
  return await readdir(runtime.audioFolder, {recursive: true, withFileTypes: true}).then(entries => {
    return entries.filter(entry => entry.isFile()).map(entry => entry.name);
  });
}

it("makes all four recordings of a new word and names them in the manifest", async () => {
  const summary = await generateAudio([DECK]);
  const manifest = await manifestWritten();

  expect(summary).toEqual({needed: 5, made: 5, characters: 9});
  expect(Object.keys(manifest["ko"]?.["물"] ?? {}).sort()).toEqual([
    "female-normal",
    "female-slower",
    "male-normal",
    "male-slower",
  ]);
});

it("does not ask Azure again for a recording it already has", async () => {
  await generateAudio([DECK]);
  const first = await manifestWritten();
  requested = 0;

  const summary = await generateAudio([DECK]);

  expect(summary.made).toBe(0);
  expect(requested).toBe(0);
  expect(await manifestWritten()).toEqual(first);
});

it("keeps what it made and writes the manifest when a recording fails", async () => {
  azureMakes({failOnRequest: 3});

  await expect(generateAudio([DECK])).rejects.toThrow("status 401");

  expect(await filesKept()).toHaveLength(2);
  expect(Object.keys((await manifestWritten())["ko"]?.["물"] ?? {})).toHaveLength(2);
});
