import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reading a Japanese kana", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ja-hiragana");
  });

  then("the kana is shown without giving its sound away", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).toBe("あ");
    expect(await webApp.review.sound.getRecordingsPlayed()).toHaveLength(0);
    expect(await webApp.review.sound.canReplay()).toBe(false);
  });

  when("they reveal its romanised sound", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("the sound is written in Latin letters", async ({webApp}) => {
      expect(await webApp.review.getBackText()).toContain("a");
    });

    then("the Japanese sound is played", async ({webApp}) => {
      const recordings = await webApp.review.sound.getRecordingsPlayed();

      expect(recordings).toHaveLength(1);
      expect(recordings[0]).toMatchObject({language: "ja", voice: "male", speed: "normal", found: true});
      expect(await webApp.review.sound.canReplay()).toBe(true);
    });
  });
});
