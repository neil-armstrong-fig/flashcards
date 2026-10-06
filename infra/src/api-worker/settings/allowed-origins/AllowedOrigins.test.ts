import {allowedOrigins} from "@src/api-worker/settings/allowed-origins/AllowedOrigins";

it("adds the local app to the deployed app origins", () => {
  expect(allowedOrigins("https://flashcards.neilarmstrong.dev")).toBe(
    "https://flashcards.neilarmstrong.dev,http://localhost:3000",
  );
});

it("uses only the local app until a deployed app origin is configured", () => {
  expect(allowedOrigins()).toBe("http://localhost:3000");
});

it("does not add the local app twice", () => {
  expect(allowedOrigins("https://flashcards.neilarmstrong.dev,http://localhost:3000")).toBe(
    "https://flashcards.neilarmstrong.dev,http://localhost:3000",
  );
});
