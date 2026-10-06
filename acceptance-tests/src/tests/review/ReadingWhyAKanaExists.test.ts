import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing the katakana for foreign sounds and the card for ファ comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ja-katakana-foreign");
  });

  then("the card is the one for ファ", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).toBe("ファ");
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
