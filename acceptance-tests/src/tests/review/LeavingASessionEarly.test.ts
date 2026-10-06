import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const CARDS_IN_THE_STARTER_DECK = 20;

given("the learner has rated one card of the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
  });

  when("they leave the session with the back button", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.leaveSession();
    });

    then("they are home, with the cards they have not done still waiting", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(CARDS_IN_THE_STARTER_DECK - 1);
    });
  });
});
