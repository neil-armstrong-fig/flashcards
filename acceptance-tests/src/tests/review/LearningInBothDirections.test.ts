import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const WORDS_IN_THE_STARTER_DECK = 10;

given("the learner starts reviewing the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("the first card shows a Korean word and asks for its English meaning", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).toBe("물");
  });

  when("its answer is shown", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("the English meaning is the answer", async ({webApp}) => {
      expect(await webApp.review.getBackText()).toContain("water");
    });
  });

  when("every Korean word has been rated easy", () => {
    beforeEach(async ({webApp}) => {
      for (let answered = 0; answered < WORDS_IN_THE_STARTER_DECK; answered += 1) {
        await webApp.review.rate("easy");
      }
    });

    then("the next card shows an English meaning and asks for the Korean word", async ({webApp}) => {
      expect(await webApp.review.getFrontText()).toBe("water");
    });

    when("its answer is shown", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.showAnswer();
      });

      then("the Korean word is the answer", async ({webApp}) => {
        expect(await webApp.review.getBackText()).toContain("물");
      });
    });
  });
});
