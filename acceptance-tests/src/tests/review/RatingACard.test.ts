import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {Rating} from "@flashcards/shared/study/Rating";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const OTHER_CARDS_IN_THE_STARTER_DECK = 19;
const OTHER_KOREAN_CARDS_BEFORE_ITS_ENGLISH_CARDS = 9;

given("the learner is reviewing the first card of the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  when("it is rated easy", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.rate("easy");
    });

    then("the next card is shown with its answer hidden", async ({webApp}) => {
      expect(await webApp.review.getFrontText()).toBe("밥");
      expect(await webApp.review.isAnswerShown()).toBe(false);
    });

    then("one fewer card remains", async ({webApp}) => {
      expect(await webApp.review.getCardsRemaining()).toBe(19);
    });
  });

  when.each(
    ["again", "hard", "good"] as const,
    rating => `it is rated ${rating} and the other cards are rated easy`,
    rating => {
      beforeEach(async ({webApp}) => {
        await webApp.review.rate(rating);
        await rateRemainingCards(webApp, "easy", OTHER_KOREAN_CARDS_BEFORE_ITS_ENGLISH_CARDS);
      });

      then(
        "it comes back for another look before the English cards, whose Korean cards were all answered",
        async ({webApp}) => {
          expect(await webApp.review.isSessionComplete()).toBe(false);
          expect(await webApp.review.getFrontText()).toBe("물");
        },
      );
    },
  );

  when("every card is rated easy", () => {
    beforeEach(async ({webApp}) => {
      await rateRemainingCards(webApp, "easy", OTHER_CARDS_IN_THE_STARTER_DECK + 1);
    });

    then("the session is complete", async ({webApp}) => {
      expect(await webApp.review.isSessionComplete()).toBe(true);
    });

    when("the learner finishes the session", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.finishSession();
      });

      then("nothing is due on the home screen", async ({webApp}) => {
        expect(await webApp.home.getCardsDueToday()).toBe(0);
      });
    });
  });
});

async function rateRemainingCards(webApp: WebApp, rating: Rating, count: number): Promise<void> {
  for (let answered = 0; answered < count; answered += 1) {
    await webApp.review.rate(rating);
  }
}
