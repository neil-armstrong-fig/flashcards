import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const MOST_CARDS_A_DAY_HOLDS = 20;

given("the learner is on the hiragana card for か, which sounds much like が", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ja-hiragana");
    await rateUntilTheFrontIs(webApp, "か");
    await webApp.review.showAnswer();
    await webApp.review.similar.open();
  });

  then("が is there to try", async ({webApp}) => {
    expect(await webApp.review.similar.getWords()).toEqual(["が"]);
  });

  then("they cannot add a word of their own, as only Korean words can be asked for", async ({webApp}) => {
    expect(await webApp.review.similar.canAdd()).toBe(false);
  });

  when("they play が", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.similar.play("が");
    });

    then("it is a Japanese recording, different from か, in the same voice and speed", async ({webApp}) => {
      const [own, , similar] = await webApp.review.sound.getRecordingsPlayed();

      expect(similar).toMatchObject({language: "ja", voice: "female", speed: "normal", found: true});
      expect(similar?.file).not.toBe(own?.file);
    });
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
