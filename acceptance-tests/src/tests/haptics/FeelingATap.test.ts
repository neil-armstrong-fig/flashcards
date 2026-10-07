import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing the first card of the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("the phone has not buzzed, as nothing has been tapped", async ({webApp}) => {
    expect(await webApp.getBuzzCount()).toBe(0);
  });

  when("they tap to hear the word again", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.sound.replay();
    });

    then("the phone buzzes once", async ({webApp}) => {
      expect(await webApp.getBuzzCount()).toBe(1);
    });
  });

  when("they show the answer and rate the card", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
      await webApp.review.rate("good");
    });

    then("the phone buzzes once", async ({webApp}) => {
      expect(await webApp.getBuzzCount()).toBe(1);
    });
  });
});
