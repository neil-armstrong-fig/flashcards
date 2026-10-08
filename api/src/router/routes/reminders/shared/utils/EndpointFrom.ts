import {isPushEndpoint} from "@src/router/routes/reminders/shared/utils/IsPushEndpoint";

/** The push address a device sent to stop being reminded at, if it is one; otherwise nothing. */
export function endpointFrom(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null || !("endpoint" in body) || !isPushEndpoint(body.endpoint)) {
    return undefined;
  }

  return body.endpoint;
}
