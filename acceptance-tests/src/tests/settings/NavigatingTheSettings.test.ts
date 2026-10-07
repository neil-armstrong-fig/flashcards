import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the settings", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
  });

  then("the settings are showing", async ({webApp}) => {
    expect(await webApp.settings.isShown()).toBe(true);
  });

  when("they tap back at the top", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.back();
    });

    then("they are on the home screen again", async ({webApp}) => {
      expect(await webApp.settings.isShown()).toBe(false);
      expect(await webApp.home.getDailyGoal()).toBe(20);
    });
  });

  when("they choose the Japanese hiragana deck", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.openDeck("ja-hiragana");
    });

    then("that deck's settings are showing, not the others'", async ({webApp}) => {
      expect(await webApp.settings.isDeckShown("ja-hiragana")).toBe(true);
      expect(await webApp.settings.isDeckShown("ko-starter")).toBe(false);
    });

    when("they tap back", () => {
      beforeEach(async ({webApp}) => {
        await webApp.settings.back();
      });

      then("they are on the settings again", async ({webApp}) => {
        expect(await webApp.settings.isShown()).toBe(true);
        expect(await webApp.settings.isDeckShown("ja-hiragana")).toBe(false);
      });
    });
  });
});
