import {byteRangeFrom} from "@flashcards/shared/http/ByteRangeFrom";

/**
 * The answer to a request for a recording the worker holds whole. A browser asks for audio in parts (`Range`), and Safari will not
 * play audio from a service worker that answers such a request with the whole file, so the part asked for is cut out and sent as
 * a 206. The other headers of the stored answer are kept.
 */
export async function partialResponseOf(request: Request, whole: Response): Promise<Response> {
  const range = byteRangeFrom(request.headers.get("Range") ?? undefined);

  if (range.kind === "whole") {
    return withRangesAccepted(whole);
  }

  const bytes = new Uint8Array(await whole.arrayBuffer());
  const size = bytes.length;
  const [start, end] = bounds(range, size);

  if (range.kind === "invalid" || start >= size || end < start) {
    return new Response(null, {status: 416, headers: {"Content-Range": `bytes */${size}`}});
  }

  const headers = new Headers(whole.headers);

  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  headers.set("Accept-Ranges", "bytes");

  return new Response(bytes.slice(start, end + 1), {status: 206, headers});
}

function withRangesAccepted(whole: Response): Response {
  const headers = new Headers(whole.headers);

  headers.set("Accept-Ranges", "bytes");

  return new Response(whole.body, {status: whole.status, headers});
}

/** The first and last byte a range covers in a file of `size`, the last cut to the file. */
function bounds(range: ReturnType<typeof byteRangeFrom>, size: number): [number, number] {
  if (range.kind === "part") {
    return [range.offset, Math.min(range.offset + range.length - 1, size - 1)];
  }

  if (range.kind === "from") {
    return [range.offset, size - 1];
  }

  if (range.kind === "last") {
    return [Math.max(0, size - range.length), size - 1];
  }

  return [0, -1];
}
