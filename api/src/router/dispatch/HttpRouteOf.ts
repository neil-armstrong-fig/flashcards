import {HTTP_ROUTES} from "@src/router/dispatch/HttpRoutes";
import type {HttpRoute} from "@src/router/dispatch/types/HttpRoute";

const AUDIO_PREFIX = "/api/audio/";

/**
 * Which of the API's routes a method and path are for, or undefined where they are for none. The one place a route is recognised:
 * what is not matched here is answered 404 and nothing else about it is looked at. The method is compared as sent (`GET`, not
 * `get`), and the path exactly, except for the recordings, whose name is the rest of the path (`router/routes/audio/recording-key/`).
 */
export function httpRouteOf(method: string, pathname: string): HttpRoute | undefined {
  if (method === "GET" && pathname.startsWith(AUDIO_PREFIX)) {
    return "GET /api/audio/*";
  }

  return HTTP_ROUTES.find(route => route === `${method} ${pathname}`);
}
