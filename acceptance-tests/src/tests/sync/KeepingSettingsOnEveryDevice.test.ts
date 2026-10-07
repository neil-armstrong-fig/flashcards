import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has set the daily goal to forty-five cards on one device", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setDailyGoal(45);
    await webApp.settings.close();
    await webApp.reload();
    await webApp.sync.waitUntilUpToDate();
  });

  when("they open the app on another device", () => {
    beforeEach(async ({secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
    });

    then("the goal there is forty-five too", async ({secondDevice}) => {
      expect(await secondDevice.home.getDailyGoal()).toBe(45);
    });
  });

  when("they set it to thirty on the other device a day later, and both devices catch up", () => {
    beforeEach(async ({webApp, secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
      await secondDevice.passDays(1);
      await secondDevice.home.openSettings();
      await secondDevice.settings.limits.setDailyGoal(30);
      await secondDevice.settings.close();
      await secondDevice.reload();
      await secondDevice.sync.waitUntilUpToDate();
      await webApp.reload();
      await webApp.sync.waitUntilUpToDate();
    });

    then("the later choice wins on both", async ({webApp, secondDevice}) => {
      expect(await webApp.home.getDailyGoal()).toBe(30);
      expect(await secondDevice.home.getDailyGoal()).toBe(30);
    });
  });
});

given("the learner has chosen dark colours on one device", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.chooseTheme("dark");
    await webApp.settings.close();
    await webApp.reload();
    await webApp.sync.waitUntilUpToDate();
  });

  when("they open the app on another device", () => {
    beforeEach(async ({secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
    });

    then("that device keeps its own colours", async ({secondDevice}) => {
      expect(await secondDevice.isShownInLightColours()).toBe(true);
    });
  });
});
