import {missingSecrets} from "@src/env/MissingSecrets";

const ALL = {
  AZURE_SPEECH_KEY: "a",
  AZURE_SPEECH_REGION: "uksouth",
  GOOGLE_OAUTH_CLIENT_ID: "c",
  GOOGLE_OAUTH_SECRET: "s",
  ALLOWED_EMAILS: "me@example.com",
};

it("is satisfied when everything is set", () => {
  expect(missingSecrets(ALL)).toEqual([]);
});

it("names each one that is missing, or empty", () => {
  expect(missingSecrets({...ALL, AZURE_SPEECH_KEY: "", GOOGLE_OAUTH_SECRET: undefined})).toEqual([
    "AZURE_SPEECH_KEY",
    "GOOGLE_OAUTH_SECRET",
  ]);
});
