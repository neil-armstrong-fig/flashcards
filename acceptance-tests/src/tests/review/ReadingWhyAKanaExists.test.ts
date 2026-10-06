import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const MOST_ANSWERS_BEFORE_THE_CARD_COMES_UP = 450;

given("the learner is reviewing katakana and the card for ファ comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(999, "ja-katakana");
    await webApp.settings.limits.setMaxReviewsPerDay(9999, "ja-katakana");
    await webApp.settings.close();
    await webApp.home.startReviewing("ja-katakana");
    await rateUntilTheFrontIs(webApp, "ファ");
  });

  then("nothing is explained until the answer is shown", async ({webApp}) => {
    expect(await webApp.review.getExplanation()).toBe("");
  });

  when("they show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("it says the kana exists for the f of foreign words, which Japanese lacks", async ({webApp}) => {
      expect(await webApp.review.getExplanation()).toContain("foreign");
    });
  });
});

given("the learner is reviewing katakana and the card for ア comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ja-katakana");
    await webApp.review.showAnswer();
  });

  then("a basic kana has nothing to explain", async ({webApp}) => {
    expect(await webApp.review.getExplanation()).toBe("");
  });
});

async function rateUntilTheFrontIs(webApp: WebApp, front: string): Promise<void> {
  for (let answered = 0; answered < MOST_ANSWERS_BEFORE_THE_CARD_COMES_UP; answered += 1) {
    if ((await webApp.review.getFrontText()) === front) {
      return;
    }

    await webApp.review.rate("easy");
  }

  throw new Error(`The card ${front} did not come up in ${MOST_ANSWERS_BEFORE_THE_CARD_COMES_UP} answers.`);
}
