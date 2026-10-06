import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const MOST_CARDS_A_DAY_HOLDS = 40;

given("the learner is reviewing katakana and the card for シ comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ja-katakana");
    await rateUntilTheFrontIs(webApp, "シ");
  });

  then("nothing about similar shapes is shown until the answer is", async ({webApp}) => {
    expect(await webApp.review.getShapeSimilars()).toEqual([]);
  });

  when("they show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("it warns that ツ, tsu, looks much like it", async ({webApp}) => {
      expect(await webApp.review.getShapeSimilars()).toEqual(["ツ tsu"]);
    });
  });
});

given("the learner is reviewing katakana and the card for ア comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ja-katakana");
    await rateUntilTheFrontIs(webApp, "ア");
    await webApp.review.showAnswer();
  });

  then("no similar shape is mentioned, because none is commonly confused with it", async ({webApp}) => {
    expect(await webApp.review.getShapeSimilars()).toEqual([]);
  });
});

given("the learner is reviewing the hiragana card for し", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ja-hiragana");
    await rateUntilTheFrontIs(webApp, "し");
    await webApp.review.showAnswer();
  });

  then("no similar katakana shape is mentioned, because that is another script", async ({webApp}) => {
    expect(await webApp.review.getShapeSimilars()).toEqual([]);
  });
});

async function rateUntilTheFrontIs(webApp: WebApp, front: string): Promise<void> {
  for (let answered = 0; answered < MOST_CARDS_A_DAY_HOLDS; answered += 1) {
    if ((await webApp.review.getFrontText()) === front) {
      return;
    }

    await webApp.review.rate("easy");
  }

  throw new Error(`The card ${front} did not come up in ${MOST_CARDS_A_DAY_HOLDS} answers.`);
}
