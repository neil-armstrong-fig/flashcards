import {apiPath} from "@src/paths/ApiPath";

it("finds the Worker's entry file in the API package", () => {
  expect(apiPath("src", "ApiWorker.ts")).toMatch(/api\/src\/ApiWorker\.ts$/);
});

it("names what it could not find", () => {
  expect(() => apiPath("src", "Missing.ts")).toThrow("The API's src/Missing.ts is not at");
});
