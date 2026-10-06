import {readManifestIcons} from "@src/dsl/web-app/playwright/install-icons/ReadManifestIcons";

it("reads the icons, with the purpose any when none is given", () => {
  const manifest = {
    icons: [
      {src: "a.png", sizes: "192x192", type: "image/png"},
      {src: "b.png", sizes: "512x512", type: "image/png", purpose: "maskable"},
    ],
  };

  expect(readManifestIcons(manifest)).toEqual([
    {src: "a.png", sizes: "192x192", type: "image/png", purpose: "any"},
    {src: "b.png", sizes: "512x512", type: "image/png", purpose: "maskable"},
  ]);
});

it("leaves out an icon that is not complete", () => {
  expect(readManifestIcons({icons: [{src: "a.png"}, 7, null]})).toEqual([]);
});

it.each([
  ["nothing", undefined],
  ["null", null],
  ["no icons", {}],
  ["icons that are not a list", {icons: "a"}],
])("finds no icons in %s", (_name, manifest) => {
  expect(readManifestIcons(manifest)).toEqual([]);
});
