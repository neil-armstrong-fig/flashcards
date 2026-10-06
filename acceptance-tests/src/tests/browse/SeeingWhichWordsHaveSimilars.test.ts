import {beforeEach, expect, given, then} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
  });

  then("the similars button is highlighted on 물, which has a similar word, 불", async ({webApp}) => {
    expect(await webApp.browse.isSimilarsHighlighted("물")).toBe(true);
  });

  then("it is not highlighted on 밥, which has none to see", async ({webApp}) => {
    expect(await webApp.browse.isSimilarsHighlighted("밥")).toBe(false);
  });
});

given("the learner is on the answer of a card for 물", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.showAnswer();
  });

  then("the compare sounds button is highlighted, as there is a similar to hear", async ({webApp}) => {
    expect(await webApp.review.similar.isHighlighted()).toBe(true);
  });
});
