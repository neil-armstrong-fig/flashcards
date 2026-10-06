import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is on a card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("the picture, note, hard, bury and suspend actions are not on the card", async ({webApp}) => {
    expect(await webApp.review.moreOptions.getActionsOnScreen()).toEqual([]);
  });

  then("the voice and speed are still on the card, to change quickly", async ({webApp}) => {
    expect(await webApp.review.sound.canSwitchVoice()).toBe(true);
    expect(await webApp.review.sound.canSwitchSpeed()).toBe(true);
  });

  when("they open the more options", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.moreOptions.open();
    });

    then("every extra action is there", async ({webApp}) => {
      expect(await webApp.review.moreOptions.getActionsOnScreen()).toEqual([
        "picture",
        "note",
        "hard",
        "bury",
        "suspend",
      ]);
    });

    when("they close them again", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.moreOptions.close();
      });

      then("the card is as it was", async ({webApp}) => {
        expect(await webApp.review.moreOptions.isOpen()).toBe(false);
        expect(await webApp.review.moreOptions.getActionsOnScreen()).toEqual([]);
      });
    });
  });
});
