import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner's device asks for dark colours", () => {
  beforeEach(async ({webApp}) => {
    await webApp.setDeviceColours("dark");
  });

  then("the app is dark", async ({webApp}) => {
    expect(await webApp.isShownInLightColours()).toBe(false);
  });

  when("they choose light colours in the settings", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.openSettings();
      await webApp.settings.chooseTheme("light");
    });

    then("the app is light", async ({webApp}) => {
      expect(await webApp.isShownInLightColours()).toBe(true);
    });

    then("the browser's bar takes the light ground colour", async ({webApp}) => {
      expect(await webApp.getBrowserBarColour()).toBe("#f4f7f6");
    });

    when("they reopen the app", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
      });

      then("it is still light", async ({webApp}) => {
        expect(await webApp.isShownInLightColours()).toBe(true);
      });
    });

    when("they reopen the app and look before it has started", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reloadBeforeTheAppStarts();
      });

      then("the page is already light, so nothing flashes dark", async ({webApp}) => {
        expect(await webApp.isShownInLightColours()).toBe(true);
      });

      then("the browser's bar is already light", async ({webApp}) => {
        expect(await webApp.getBrowserBarColour()).toBe("#f4f7f6");
      });
    });

    when("they go back to following the device", () => {
      beforeEach(async ({webApp}) => {
        await webApp.settings.chooseTheme("system");
      });

      then("the app is dark again", async ({webApp}) => {
        expect(await webApp.isShownInLightColours()).toBe(false);
      });
    });
  });
});

given("the learner's device asks for light colours", () => {
  beforeEach(async ({webApp}) => {
    await webApp.setDeviceColours("light");
  });

  then("the app is light", async ({webApp}) => {
    expect(await webApp.isShownInLightColours()).toBe(true);
  });

  when("they open the settings", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.openSettings();
    });

    then("they say the colours follow the device", async ({webApp}) => {
      expect(await webApp.settings.getTheme()).toBe("system");
    });
  });

  when("they choose dark colours in the settings", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.openSettings();
      await webApp.settings.chooseTheme("dark");
    });

    then("the app is dark", async ({webApp}) => {
      expect(await webApp.isShownInLightColours()).toBe(false);
    });

    then("the browser's bar takes the dark ground colour", async ({webApp}) => {
      expect(await webApp.getBrowserBarColour()).toBe("#000000");
    });
  });
});
