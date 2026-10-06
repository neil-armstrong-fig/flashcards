import {workerEnvironment} from "@src/env/WorkerEnvironment";
import {googleRedirectUri} from "@src/router/sign-in/shared/google/GoogleRedirectUri";

const request = new Request("https://flashcards-api.neilarmstrong.dev/api/auth/google");

afterEach(() => {
  Reflect.deleteProperty(workerEnvironment, "GOOGLE_REDIRECT_URI");
});

it("sends a local app callback through its local API proxy", () => {
  expect(googleRedirectUri(request, "http://localhost:3000/settings")).toBe(
    "http://localhost:8787/api/auth/google/callback",
  );
});

it("sends a deployed app callback back to the API that received the request", () => {
  expect(googleRedirectUri(request, "https://flashcards.neilarmstrong.dev/settings")).toBe(
    "https://flashcards-api.neilarmstrong.dev/api/auth/google/callback",
  );
});

it("uses the explicit callback configured for ordinary local API development", () => {
  workerEnvironment.GOOGLE_REDIRECT_URI = "http://localhost:8787/api/auth/google/callback";

  expect(googleRedirectUri(request, "http://localhost:3000/settings")).toBe(
    "http://localhost:8787/api/auth/google/callback",
  );
});
