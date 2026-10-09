import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner starts reviewing a deck from the home screen", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  when("they use the browser's back button", () => {
    beforeEach(async ({webApp}) => {
      await webApp.goBack();
    });

    then("they return home and the unfinished cards are still waiting", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(20);
    });
  });
});
