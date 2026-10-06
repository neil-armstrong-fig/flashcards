import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the settings", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
  });

  then("the daily goal starts at twenty cards", async ({webApp}) => {
    expect(await webApp.settings.limits.getDailyGoal()).toBe(20);
  });

  when("they set the daily goal to forty-five cards and go back", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.limits.setDailyGoal(45);
      await webApp.settings.close();
    });

    then("the home screen shows forty-five", async ({webApp}) => {
      expect(await webApp.home.getDailyGoal()).toBe(45);
    });

    when("they reopen the app", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
      });

      then("the goal is still forty-five", async ({webApp}) => {
        expect(await webApp.home.getDailyGoal()).toBe(45);
      });
    });
  });
});
