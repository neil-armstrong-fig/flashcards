import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const MOST_ANSWERS_BEFORE_THE_CARD_COMES_UP = 150;

given("the learner is reviewing hiragana and the card for ぬ comes up", () => {
  beforeEach(async ({webApp}) => {
    await takeOnEveryCard(webApp);
    await webApp.home.startReviewing("ja-hiragana");
    await rateUntilTheFrontIs(webApp, "ぬ");
  });

  then("nothing about similar shapes is shown until the answer is", async ({webApp}) => {
    expect(await webApp.review.getShapeSimilars()).toEqual([]);
  });

  when("they show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("it warns that め, me, looks much like it", async ({webApp}) => {
      expect(await webApp.review.getShapeSimilars()).toEqual(["め me"]);
    });
  });
});

given("the learner is reviewing hiragana and the card for わ comes up", () => {
  beforeEach(async ({webApp}) => {
    await takeOnEveryCard(webApp);
    await webApp.home.startReviewing("ja-hiragana");
    await rateUntilTheFrontIs(webApp, "わ");
    await webApp.review.showAnswer();
  });

  then("it warns about both れ and ね, which are alike too", async ({webApp}) => {
    expect(await webApp.review.getShapeSimilars()).toEqual(["れ re", "ね ne"]);
  });
});

given("the learner is reviewing hiragana and the card for あ comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ja-hiragana");
    await webApp.review.showAnswer();
  });

  then("no similar shape is mentioned, because none is commonly confused with it", async ({webApp}) => {
    expect(await webApp.review.getShapeSimilars()).toEqual([]);
  });
});

/** A day holds only twenty new cards, and these kana are further down the deck than that. */
async function takeOnEveryCard(webApp: WebApp): Promise<void> {
  await webApp.home.openSettings();
  await webApp.settings.limits.setNewCardsPerDay(999, "ja-hiragana");
  await webApp.settings.limits.setMaxReviewsPerDay(9999, "ja-hiragana");
  await webApp.settings.close();
}

async function rateUntilTheFrontIs(webApp: WebApp, front: string): Promise<void> {
  for (let answered = 0; answered < MOST_ANSWERS_BEFORE_THE_CARD_COMES_UP; answered += 1) {
    if ((await webApp.review.getFrontText()) === front) {
      return;
    }

    await webApp.review.rate("easy");
  }

  throw new Error(`The card ${front} did not come up in ${MOST_ANSWERS_BEFORE_THE_CARD_COMES_UP} answers.`);
}
