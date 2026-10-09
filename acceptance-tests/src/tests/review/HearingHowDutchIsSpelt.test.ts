import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing the Dutch pronunciation deck and the first card comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("nl-pronunciation");
  });

  then("the card shows the spelling, bed", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).toBe("bed");
  });

  then("nothing is said, so the learner reads it aloud first", async ({webApp}) => {
    expect(await webApp.review.sound.getRecordingsPlayed()).toHaveLength(0);
  });

  when("they show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("how it sounds is respelt for an English reader", async ({webApp}) => {
      expect(await webApp.review.getBackText()).toContain("[bet]");
    });

    then("what it means in English is shown too", async ({webApp}) => {
      expect(await webApp.review.getBackText()).toContain("(bed)");
    });

    then("the word is spoken in Dutch, once", async ({webApp}) => {
      const recordings = await webApp.review.sound.getRecordingsPlayed();

      expect(recordings).toHaveLength(1);
      expect(recordings[0]).toMatchObject({language: "nl", found: true});
    });

    then("the pattern behind it is explained", async ({webApp}) => {
      expect(await webApp.review.getExplanation()).toContain("short");
    });
  });
});

given("the learner opens the list of every card and chooses the Dutch pronunciation deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
    await webApp.browse.chooseDeck("nl-pronunciation");
  });

  then("each word is one card, because there is nothing to say in English", async ({webApp}) => {
    expect(await webApp.browse.getCardCount()).toBe(91);
  });
});
