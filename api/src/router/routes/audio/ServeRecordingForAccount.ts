import {recordingKeyFrom} from "@src/router/routes/audio/recording-key/RecordingKeyFrom";
import {serveRecording} from "@src/router/routes/audio/serve/ServeRecording";

const AUDIO_PREFIX = "/api/audio/";

/** `GET /api/audio/<language>/<voice>-<speed>/<hash>.mp3`: a recording, for a signed-in account only. A name the app does not make is a 404. */
export async function serveRecordingForAccount(request: Request): Promise<Response> {
  const key = recordingKeyFrom(new URL(request.url).pathname.slice(AUDIO_PREFIX.length));

  if (key === undefined) {
    return new Response(null, {status: 404});
  }

  return await serveRecording(request, key);
}
