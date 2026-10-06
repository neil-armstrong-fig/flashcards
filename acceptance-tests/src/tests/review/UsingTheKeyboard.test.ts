import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing the first card of the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  when("they press space", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswerWithKeyboard();
    });

    then("the answer is shown", async ({webApp}) => {
      expect(await webApp.review.isAnswerShown()).toBe(true);
    });

    when("they press 3 to rate it good", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.rateWithKeyboard("good");
      });

      then("the next card is shown with its answer hidden", async ({webApp}) => {
        expect(await webApp.review.getFrontText()).toBe("밥");
        expect(await webApp.review.isAnswerShown()).toBe(false);
      });
    });
  });

  when("they press a rating key before the answer is shown", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.rateWithKeyboard("easy");
    });

    then("the card has not been rated", async ({webApp}) => {
      expect(await webApp.review.getFrontText()).toBe("물");
      expect(await webApp.review.getCardsRemaining()).toBe(20);
    });
  });
});
