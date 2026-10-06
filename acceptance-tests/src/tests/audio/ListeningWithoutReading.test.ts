import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has not asked to hide the words", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("the Korean word is shown on the front of the card", async ({webApp}) => {
    expect(await webApp.review.isFrontHidden()).toBe(false);
  });
});

given("the learner chooses to listen without reading", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.struggling.setListenOnly(true);
    await webApp.settings.close();
  });

  when("they open the settings again", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.openSettings();
    });

    then("the choice shows as on", async ({webApp}) => {
      expect(await webApp.settings.struggling.isListenOnly()).toBe(true);
    });
  });

  when("they start reviewing", () => {
    beforeEach(async ({webApp}) => {
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

  when("they reopen the app and start reviewing", () => {
    beforeEach(async ({webApp}) => {
      await webApp.reload();
      await webApp.home.startReviewing();
    });

    then("the word is still hidden", async ({webApp}) => {
      expect(await webApp.review.isFrontHidden()).toBe(true);
    });
  });
});
