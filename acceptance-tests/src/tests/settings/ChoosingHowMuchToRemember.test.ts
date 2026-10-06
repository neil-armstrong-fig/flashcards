import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const A_LONG_TIME = 90;

given("the learner has learned the first card, and it is due again after a long time", () => {
  beforeEach(async ({webApp}) => {
    await learnTheFirstCardAndLetTimePass(webApp);
  });

  when("they open the settings", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.openSettings();
    });

    then("they ask to remember 90 percent of what they review", async ({webApp}) => {
      expect(await webApp.settings.limits.getDesiredRetention()).toBe(90);
    });
  });

  when("they start reviewing and show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.startReviewing();
      await webApp.review.showAnswer();
    });

    then("good says when it returns, as it does by default", async ({webApp}) => {
      expect(await webApp.review.getIntervalLabel("good")).toBe("3.9mo");
    });
  });

  when("they ask to remember 97 percent, and show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.openSettings();
      await webApp.settings.limits.setDesiredRetention(97);
      await webApp.settings.close();
      await webApp.home.startReviewing();
      await webApp.review.showAnswer();
    });

    then("good brings the card back sooner", async ({webApp}) => {
      expect(await webApp.review.getIntervalLabel("good")).toBe("26d");
    });
  });

  when("they ask to remember only 70 percent, and show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.openSettings();
      await webApp.settings.limits.setDesiredRetention(70);
      await webApp.settings.close();
      await webApp.home.startReviewing();
      await webApp.review.showAnswer();
    });

    then("good leaves the card longer", async ({webApp}) => {
      expect(await webApp.review.getIntervalLabel("good")).toBe("3y");
    });
  });

  when("they ask for more than can be asked, and reopen the settings", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.openSettings();
      await webApp.settings.limits.setDesiredRetention(100);
      await webApp.settings.close();
      await webApp.home.openSettings();
    });

    then("it is kept at 97 percent", async ({webApp}) => {
      expect(await webApp.settings.limits.getDesiredRetention()).toBe(97);
    });
  });
});

async function learnTheFirstCardAndLetTimePass(webApp: WebApp): Promise<void> {
  await webApp.home.openSettings();
  await webApp.settings.limits.setNewCardsPerDay(1);
  await webApp.settings.close();
  await webApp.home.startReviewing();
  await webApp.review.rate("easy");
  await webApp.review.finishSession();
  await webApp.home.openSettings();
  await webApp.settings.limits.setNewCardsPerDay(0);
  await webApp.settings.close();
  await webApp.passDays(A_LONG_TIME);
}
