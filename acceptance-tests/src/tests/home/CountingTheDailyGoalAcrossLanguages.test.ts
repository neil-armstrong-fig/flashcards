import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has set a daily goal of two cards", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setDailyGoal(2);
    await webApp.settings.limits.setNewCardsPerDay(1, "ko-starter");
    await webApp.settings.limits.setNewCardsPerDay(1, "ja-hiragana");
    await webApp.settings.close();
  });

  when("they review one Korean card and one hiragana card", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.startReviewing("ko-starter");
      await webApp.review.rate("easy");
      await webApp.review.finishSession();
      await webApp.home.startReviewing("ja-hiragana");
      await webApp.review.rate("easy");
      await webApp.review.finishSession();
    });

    then("both are counted towards the one goal, and it is met", async ({webApp}) => {
      expect(await webApp.home.getCardsReviewedToday()).toBe(2);
      expect(await webApp.home.isDailyGoalMet()).toBe(true);
    });
  });

  when("they review one Korean card and stop", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.startReviewing("ko-starter");
      await webApp.review.rate("easy");
      await webApp.review.finishSession();
    });

    then("the goal is not yet met", async ({webApp}) => {
      expect(await webApp.home.getCardsReviewedToday()).toBe(1);
      expect(await webApp.home.isDailyGoalMet()).toBe(false);
    });
  });
});
