import {readManifestNames} from "@src/dsl/web-app/playwright/manifest-names/ReadManifestNames";

it("reads the name and the short name", () => {
  expect(readManifestNames({name: "Flash Cards", short_name: "Cards", icons: []})).toEqual({
    name: "Flash Cards",
    shortName: "Cards",
  });
});

it("leaves out a name that is not text", () => {
  expect(readManifestNames({name: 7, short_name: null})).toEqual({name: undefined, shortName: undefined});
});

it("reads nothing from something that is not a manifest", () => {
  expect(readManifestNames("Flash Cards")).toEqual({});
  expect(readManifestNames(null)).toEqual({});
});
