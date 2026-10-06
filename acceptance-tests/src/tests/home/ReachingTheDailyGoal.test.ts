import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has set a daily goal of three cards", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setDailyGoal(3);
    await webApp.settings.limits.setNewCardsPerDay(2);
    await webApp.settings.close();
  });

  when("they review two cards", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.startReviewing();
      await webApp.review.rate("easy");
      await webApp.review.rate("easy");
      await webApp.review.finishSession();
    });

    then("two cards are counted, and the goal is not yet met", async ({webApp}) => {
      expect(await webApp.home.getCardsReviewedToday()).toBe(2);
      expect(await webApp.home.isDailyGoalMet()).toBe(false);
    });

    when("they review a third", () => {
      beforeEach(async ({webApp}) => {
        await webApp.home.openSettings();
        await webApp.settings.limits.setNewCardsPerDay(3);
        await webApp.settings.close();
        await webApp.home.startReviewing();
        await webApp.review.rate("easy");
        await webApp.review.finishSession();
      });

      then("three cards are counted, and the goal is met", async ({webApp}) => {
        expect(await webApp.home.getCardsReviewedToday()).toBe(3);
        expect(await webApp.home.isDailyGoalMet()).toBe(true);
      });

      when("they reopen the app", () => {
        beforeEach(async ({webApp}) => {
          await webApp.reload();
        });

        then("the goal is still met, because the answers were kept", async ({webApp}) => {
          expect(await webApp.home.isDailyGoalMet()).toBe(true);
        });
      });
    });
  });
});
