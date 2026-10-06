import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
  });

  when("they tap the text of a card rather than its play button", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.tapCard("물");
    });

    then("its Korean word is played", async ({webApp}) => {
      const [recording] = await webApp.review.sound.getRecordingsPlayed();

      expect(recording).toMatchObject({language: "ko", found: true});
    });
  });

  when("they narrow the list to the foreign-sound katakana and play ファ", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.chooseDeck("ja-katakana-foreign");
      await webApp.browse.play("ファ");
    });

    then("its Japanese recording is played", async ({webApp}) => {
      const [recording] = await webApp.review.sound.getRecordingsPlayed();

      expect(recording).toMatchObject({language: "ja", found: true});
    });
  });

  when("they switch the voice and play a card", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.switchVoice();
      await webApp.browse.play("물");
    });

    then("it is the female voice at normal speed", async ({webApp}) => {
      const [recording] = await webApp.review.sound.getRecordingsPlayed();

      expect(recording).toMatchObject({voice: "female", speed: "normal"});
    });
  });

  when("they switch the speed and play a card", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.switchSpeed();
      await webApp.browse.play("물");
    });

    then("it is the male voice, slower", async ({webApp}) => {
      const [recording] = await webApp.review.sound.getRecordingsPlayed();

      expect(recording).toMatchObject({voice: "male", speed: "slower"});
    });
  });

  when("they switch the voice and go to the settings", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.switchVoice();
      await webApp.browse.close();
      await webApp.home.openSettings();
    });

    then("the female voice is the one chosen there, because it is one setting", async ({webApp}) => {
      expect(await webApp.settings.voice.getVoice()).toBe("female");
    });
  });
});
