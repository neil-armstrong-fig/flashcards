import {partialResponseOf} from "@src/sw/workers/recordings/partial-response/PartialResponseOf";

const BYTES = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

function whole(): Response {
  return new Response(BYTES, {status: 200, headers: {"Content-Type": "audio/mpeg"}});
}

function asking(range?: string): Request {
  const headers = new Headers();

  if (range !== undefined) {
    headers.set("Range", range);
  }

  return new Request("https://app.example/audio/ko/female-normal/c2f16032c0b9c1ea.mp3", {headers});
}

it("gives the whole recording where no range is asked for, and says ranges are welcome", async () => {
  const response = await partialResponseOf(asking(), whole());

  expect(response.status).toBe(200);
  expect(response.headers.get("Accept-Ranges")).toBe("bytes");
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(BYTES);
});

it("gives just the stretch asked for, as 206, which Safari insists on for audio", async () => {
  const response = await partialResponseOf(asking("bytes=2-4"), whole());

  expect(response.status).toBe(206);
  expect(response.headers.get("Content-Range")).toBe("bytes 2-4/10");
  expect(response.headers.get("Content-Type")).toBe("audio/mpeg");
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([2, 3, 4]));
});

it.each([
  ["from a point", "bytes=7-", [7, 8, 9], "bytes 7-9/10"],
  ["the last bytes", "bytes=-2", [8, 9], "bytes 8-9/10"],
  ["an end past the file, cut to it", "bytes=8-99", [8, 9], "bytes 8-9/10"],
])("gives %s", async (_name, range, bytes, contentRange) => {
  const response = await partialResponseOf(asking(range), whole());

  expect(response.status).toBe(206);
  expect(response.headers.get("Content-Range")).toBe(contentRange);
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array(bytes));
});

it("answers 416 for a range that starts past the end, and for one that makes no sense", async () => {
  expect((await partialResponseOf(asking("bytes=50-60"), whole())).status).toBe(416);
  expect((await partialResponseOf(asking("bytes=9-0"), whole())).status).toBe(416);
});
