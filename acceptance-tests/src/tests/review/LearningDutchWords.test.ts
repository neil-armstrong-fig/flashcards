import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing the Dutch starter deck and the first card comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("nl-starter");
  });

  then("the Dutch word is shown", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).toBe("water");
  });

  then("the Dutch word is spoken in a Netherlands voice", async ({webApp}) => {
    const recordings = await webApp.review.sound.getRecordingsPlayed();

    expect(recordings).toHaveLength(1);
    expect(recordings[0]).toMatchObject({language: "nl", voice: "male", speed: "normal", found: true});
  });

  when("they show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("the English meaning is shown", async ({webApp}) => {
      expect(await webApp.review.getBackText()).toContain("water");
    });
  });
});

given("the learner opens the list of every card and chooses the Dutch starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
    await webApp.browse.chooseDeck("nl-starter");
  });

  then("each word is two cards, one in each direction", async ({webApp}) => {
    expect(await webApp.browse.getCardCount()).toBe(200);
  });
});
