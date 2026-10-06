import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing a card they have never seen", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  when("the answer is shown", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("again says the card returns in a minute", async ({webApp}) => {
      expect(await webApp.review.getIntervalLabel("again")).toBe("1m");
    });

    then("hard says the card returns in six minutes", async ({webApp}) => {
      expect(await webApp.review.getIntervalLabel("hard")).toBe("6m");
    });

    then("good says the card returns in ten minutes", async ({webApp}) => {
      expect(await webApp.review.getIntervalLabel("good")).toBe("10m");
    });

    then("easy says the card returns in days", async ({webApp}) => {
      expect(await webApp.review.getIntervalLabel("easy")).toMatch(/^\d+d$/);
    });
  });
});
