import {runtime} from "@src/runtime/Runtime";
import {uploadListOf} from "@src/upload/UploadListOf";

beforeEach(() => {
  runtime.audioFolder = "/rec/";
});

it("names each recording in the bucket by its path under the recordings folder, which is how the app asks for it", () => {
  expect(uploadListOf(["ko/female-normal/c2f16032c0b9c1ea.mp3"])).toEqual([
    {key: "ko/female-normal/c2f16032c0b9c1ea.mp3", file: "/rec/ko/female-normal/c2f16032c0b9c1ea.mp3"},
  ]);
});

it("leaves out anything that is not a recording, so a stray file never reaches the bucket", () => {
  expect(uploadListOf([".DS_Store", "notes.txt", "ja/male-slower/a1a05b6c2399ecbf.mp3"])).toEqual([
    {key: "ja/male-slower/a1a05b6c2399ecbf.mp3", file: "/rec/ja/male-slower/a1a05b6c2399ecbf.mp3"},
  ]);
});

it("takes the tone of a note of music like any other recording", () => {
  expect(uploadListOf(["music/female-normal/710a8b5afdc11696.mp3"])).toEqual([
    {key: "music/female-normal/710a8b5afdc11696.mp3", file: "/rec/music/female-normal/710a8b5afdc11696.mp3"},
  ]);
});

it("is empty when there is nothing to upload", () => {
  expect(uploadListOf([])).toEqual([]);
});
