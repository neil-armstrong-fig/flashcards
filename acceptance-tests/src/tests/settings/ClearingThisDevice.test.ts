import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has kept the hiragana deck offline", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.keepOffline("ja-hiragana");
    await webApp.home.openSettings();
  });

  when("they start clearing this device", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.device.startClearing();
    });

    then("they are warned that anything not yet synced is lost", async ({webApp}) => {
      expect(await webApp.settings.device.getWarning()).toContain("not yet synced");
    });

    when("they change their mind", () => {
      beforeEach(async ({webApp}) => {
        await webApp.settings.device.cancelClearing();
      });

      then("the recordings are still kept", async ({webApp}) => {
        expect(await webApp.getRecordingsOnThisDevice()).toBeGreaterThan(0);
      });
    });

    when("they confirm", () => {
      beforeEach(async ({webApp}) => {
        await webApp.settings.device.confirmClearing();
      });

      then("the device keeps no recordings", async ({webApp}) => {
        expect(await webApp.getRecordingsOnThisDevice()).toBe(0);
      });

      then("they are still signed in", async ({webApp}) => {
        expect(await webApp.settings.account.isSignedIn()).toBe(true);
      });
    });
  });
});
