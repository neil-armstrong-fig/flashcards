import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has not asked to hide the words", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("the Korean word is shown on the front of the card", async ({webApp}) => {
    expect(await webApp.review.isFrontHidden()).toBe(false);
  });
});

given("the learner is reviewing the starter deck and hides the Korean word from the more options", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.moreOptions.setTargetTextHidden(true);
  });

  then("the word is not shown on the card in front of them", async ({webApp}) => {
    expect(await webApp.review.isFrontHidden()).toBe(true);
  });

  when("they turn it back on", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.moreOptions.setTargetTextHidden(false);
    });

    then("the word is shown again", async ({webApp}) => {
      expect(await webApp.review.isFrontHidden()).toBe(false);
    });
  });

  when("they leave and start another deck", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.leaveSession();
      await webApp.home.startReviewing("ja-hiragana");
    });

    then("that deck still shows its words, as the choice is for the starter deck alone", async ({webApp}) => {
      expect(await webApp.review.isFrontHidden()).toBe(false);
    });
  });

  when("they reopen the app and start the deck again", () => {
    beforeEach(async ({webApp}) => {
      await webApp.reload();
      await webApp.home.startReviewing();
    });

    then("the word is spoken but not shown", async ({webApp}) => {
      expect(await webApp.review.sound.getRecordingsPlayed()).toHaveLength(1);
      expect(await webApp.review.isFrontHidden()).toBe(true);
    });

    when("the answer is shown", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.showAnswer();
      });

      then("the word is shown with its meaning", async ({webApp}) => {
        expect(await webApp.review.isFrontHidden()).toBe(false);
        expect(await webApp.review.getFrontText()).toBe("물");
        expect(await webApp.review.getBackText()).toContain("water");
      });
    });

    when("they replay it", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.sound.replay();
      });

      then("it is heard again and the word stays hidden", async ({webApp}) => {
        expect(await webApp.review.sound.getRecordingsPlayed()).toHaveLength(2);
        expect(await webApp.review.isFrontHidden()).toBe(true);
      });
    });
  });
});
