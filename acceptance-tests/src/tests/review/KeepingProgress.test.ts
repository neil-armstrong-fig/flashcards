import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/** Ten words, each learned in both directions. */
const CARDS_IN_THE_STARTER_DECK = 20;

given("the learner has rated the first card easy", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
  });

  when("the app is opened again", () => {
    beforeEach(async ({webApp}) => {
      await webApp.reload();
    });

    then("that card is no longer waiting", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(19);
    });

    when("they start reviewing", () => {
      beforeEach(async ({webApp}) => {
        await webApp.home.startReviewing();
      });

      then("reviewing carries on with the next card", async ({webApp}) => {
        expect(await webApp.review.getFrontText()).toBe("밥");
      });
    });
  });
});

given("the learner has learned the whole starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    for (let answered = 0; answered < CARDS_IN_THE_STARTER_DECK; answered += 1) {
      await webApp.review.rate("easy");
    }
  });

  when("the app is opened again the same day", () => {
    beforeEach(async ({webApp}) => {
      await webApp.reload();
    });

    then("nothing is due today", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(0);
    });
  });

  when("a month goes by", () => {
    beforeEach(async ({webApp}) => {
      await webApp.passDays(30);
    });

    then("every card is due for review again", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(CARDS_IN_THE_STARTER_DECK);
    });
  });
});
