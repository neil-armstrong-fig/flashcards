import {httpRouteOf} from "@src/router/dispatch/HttpRouteOf";

it("finds a route by its method and exact path", () => {
  expect(httpRouteOf("POST", "/api/speech")).toBe("POST /api/speech");
});

it("finds the recordings by the start of the path, whatever recording is asked for", () => {
  expect(httpRouteOf("GET", "/api/audio/ko/female-normal/c2f16032c0b9c1ea.mp3")).toBe("GET /api/audio/*");
});

it.each([
  ["a method the route does not have", "GET", "/api/speech"],
  ["a path with something after it", "POST", "/api/speech/extra"],
  ["a lower-case method", "post", "/api/speech"],
  ["the old, unprefixed path", "POST", "/speech"],
  ["a recording asked for by any method but GET", "POST", "/api/audio/ko/female-normal/c2f16032c0b9c1ea.mp3"],
  ["the audio folder without a recording", "PUT", "/api/audio/"],
  ["a path that only looks like the folder", "GET", "/api/audiobook/x"],
])("finds nothing for %s", (_name, method, path) => {
  expect(httpRouteOf(method, path)).toBeUndefined();
});
