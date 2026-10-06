import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner starts reviewing the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("the first card shows its front and not its answer", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).toBe("물");
    expect(await webApp.review.isAnswerShown()).toBe(false);
  });

  then("the card cannot be rated before the answer is shown", async ({webApp}) => {
    expect(await webApp.review.canRate("good")).toBe(false);
  });

  when("the answer is shown", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("the meaning is shown", async ({webApp}) => {
      expect(await webApp.review.getBackText()).toContain("water");
    });

    then("every rating can be chosen", async ({webApp}) => {
      expect(await webApp.review.canRate("again")).toBe(true);
      expect(await webApp.review.canRate("hard")).toBe(true);
      expect(await webApp.review.canRate("good")).toBe(true);
      expect(await webApp.review.canRate("easy")).toBe(true);
    });
  });
});
