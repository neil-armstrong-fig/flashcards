import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const CARDS_IN_THE_STARTER_DECK = 20;

given("the learner has added 코끼리, elephant, and set all but one of the deck's own cards aside", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
    await webApp.browse.cardForm.addCard({word: "코끼리", meaning: "elephant", romanisation: "kokkiri"});
    await webApp.browse.close();
    await webApp.home.startReviewing();

    for (let buried = 0; buried < CARDS_IN_THE_STARTER_DECK - 1; buried++) {
      await webApp.review.bury();
    }
  });

  when("they answer the deck's last card, then 코끼리", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
      await webApp.review.rate("good");
      await webApp.review.showAnswer();
    });

    then("it is the Korean card they are answering", async ({webApp}) => {
      expect(await webApp.review.getFrontText()).toBe("코끼리");
    });

    when("they answer it", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.rate("good");
      });

      then("its English card is held back, and the deck's card comes up instead", async ({webApp}) => {
        expect(await webApp.review.getFrontText()).not.toBe("elephant");
      });
    });
  });
});
