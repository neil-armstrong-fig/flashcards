import {expect, given, then} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the app in a browser that can install it", () => {
  then("it offers an icon of 192 pixels that loads, for Android's install prompt", async ({webApp}) => {
    expect(await webApp.getInstallIcons()).toContainEqual({
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
      loads: true,
    });
  });

  then("it offers an icon of 512 pixels that loads, for the splash screen", async ({webApp}) => {
    expect(await webApp.getInstallIcons()).toContainEqual({
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
      loads: true,
    });
  });

  then("it offers a maskable icon that loads, so Android can crop it to any shape", async ({webApp}) => {
    expect(await webApp.getInstallIcons()).toContainEqual({
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
      loads: true,
    });
  });

  then("it offers a home screen icon for iPhones that loads", async ({webApp}) => {
    expect(await webApp.isHomeScreenIconForIphonesLoaded()).toBe(true);
  });
});
