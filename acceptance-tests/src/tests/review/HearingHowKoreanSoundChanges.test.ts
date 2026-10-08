import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing the Korean pronunciation deck and the card for 좋다 comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ko-pronunciation");
  });

  then("the card shows the spelling, 좋다", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).toBe("좋다");
  });

  then("nothing is said, so the learner reads it aloud first", async ({webApp}) => {
    expect(await webApp.review.sound.getRecordingsPlayed()).toHaveLength(0);
  });

  then("the way it is said is not shown yet", async ({webApp}) => {
    expect(await webApp.review.isAnswerShown()).toBe(false);
    expect(await webApp.review.getExplanation()).toBe("");
  });

  when("they show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("the spelling stays and the way it is said is written in hangul, with its romanisation", async ({webApp}) => {
      expect(await webApp.review.getFrontText()).toBe("좋다");
      expect(await webApp.review.getBackText()).toContain("[조타]");
      expect(await webApp.review.getBackText()).toContain("jota");
    });

    then("the word is spoken, once", async ({webApp}) => {
      const recordings = await webApp.review.sound.getRecordingsPlayed();

      expect(recordings).toHaveLength(1);
      expect(recordings[0]).toMatchObject({language: "ko", voice: "male", speed: "normal", found: true});
    });

    then("the rule behind the change is explained", async ({webApp}) => {
      expect(await webApp.review.getExplanation()).toContain("ㅎ");
    });
  });
});

given("the learner opens the list of every card and chooses the Korean pronunciation deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
    await webApp.browse.chooseDeck("ko-pronunciation");
  });

  then("each word is one card, because there is nothing to say in English", async ({webApp}) => {
    expect(await webApp.browse.getCardCount()).toBe(84);
  });
});
