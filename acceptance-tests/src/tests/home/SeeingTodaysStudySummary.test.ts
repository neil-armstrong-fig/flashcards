import {expect, given, then} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the app for the first time", () => {
  then("twenty cards are waiting: the ten words of the starter deck, each learned both ways", async ({webApp}) => {
    expect(await webApp.home.getCardsDueToday()).toBe(20);
  });

  then("the daily goal is twenty cards, none reviewed yet", async ({webApp}) => {
    expect(await webApp.home.getDailyGoal()).toBe(20);
    expect(await webApp.home.getCardsReviewedToday()).toBe(0);
    expect(await webApp.home.isDailyGoalMet()).toBe(false);
  });
});
