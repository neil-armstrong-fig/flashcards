import {beforeEach, expect, given, then} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const A_LONG_TIME = 90;

given("the learner opens the app for the first time", () => {
  then("the starter deck has twenty new cards and nothing to learn or review", async ({webApp}) => {
    expect(await webApp.home.getDeckDueCounts("ko-starter")).toEqual({new: 20, learning: 0, review: 0});
  });
});

given("the learner allows one new card a day and forgets it the first time they see it", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(1);
    await webApp.settings.close();
    await webApp.home.startReviewing();
    await webApp.review.rate("again");
    await webApp.reload();
  });

  then("it is waiting to be learned, and no new card is left for today", async ({webApp}) => {
    expect(await webApp.home.getDeckDueCounts("ko-starter")).toEqual({new: 0, learning: 1, review: 0});
  });

  then("the deck's total is the three added together", async ({webApp}) => {
    expect(await webApp.home.getCardsDueToday("ko-starter")).toBe(1);
  });
});

given("the learner learned a card and a long time has gone by", () => {
  beforeEach(async ({webApp}) => {
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
  });

  then("that card is waiting for review, and nothing else is", async ({webApp}) => {
    expect(await webApp.home.getDeckDueCounts("ko-starter")).toEqual({new: 0, learning: 0, review: 1});
  });

  then("another deck is untouched", async ({webApp}) => {
    expect(await webApp.home.getDeckDueCounts("ja-hiragana")).toEqual({new: 20, learning: 0, review: 0});
  });
});
