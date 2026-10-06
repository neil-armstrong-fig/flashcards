import {byteRangeFrom} from "@flashcards/shared/http/ByteRangeFrom";
import {headerOf} from "@src/router/request/HeaderOf";
import {readRecording} from "@src/buckets/recordings/ReadRecording";

const FOR_A_YEAR_ON_THIS_DEVICE = "private, max-age=31536000, immutable";

/**
 * The recording under `key`, as a response. A recording is a pure function of the text, the voice and the speed, and its name is a
 * hash of them, so a browser may keep it for ever (`immutable`), and `private` stops anything shared in between from keeping it for
 * someone else. Byte ranges are answered because iOS will not play audio it cannot ask for in parts.
 */
export async function serveRecording(request: Request, key: string): Promise<Response> {
  const range = byteRangeFrom(headerOf(request, "Range"));

  if (range.kind === "invalid") {
    return new Response(null, {status: 416});
  }

  const stored = await readRecording(key, range);

  if (stored === undefined) {
    return new Response(null, {status: 404});
  }

  const headers = new Headers({
    "Content-Type": "audio/mpeg",
    "Content-Length": String(stored.length),
    "Accept-Ranges": "bytes",
    "Cache-Control": FOR_A_YEAR_ON_THIS_DEVICE,
    "X-Content-Type-Options": "nosniff",
  });

  if (range.kind === "whole") {
    return new Response(stored.body, {status: 200, headers});
  }

  if (stored.length === 0) {
    return new Response(null, {status: 416, headers: {"Content-Range": `bytes */${stored.size}`}});
  }

  headers.set("Content-Range", `bytes ${stored.offset}-${stored.offset + stored.length - 1}/${stored.size}`);

  return new Response(stored.body, {status: 206, headers});
}
