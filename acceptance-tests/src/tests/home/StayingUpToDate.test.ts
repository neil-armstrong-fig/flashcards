import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const CARDS_IN_THE_STARTER_DECK = 20;

given("the learner has learned the whole starter deck and is back on the home screen", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    for (let answered = 0; answered < CARDS_IN_THE_STARTER_DECK; answered += 1) {
      await webApp.review.rate("easy");
    }
    await webApp.review.finishSession();
  });

  then("nothing is due", async ({webApp}) => {
    expect(await webApp.home.getCardsDueToday()).toBe(0);
  });

  when("three weeks go by with the app left open", () => {
    beforeEach(async ({webApp}) => {
      await webApp.letDaysPass(21);
    });

    then("the cards that have fallen due are counted without reopening the app", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(CARDS_IN_THE_STARTER_DECK);
    });
  });
});
