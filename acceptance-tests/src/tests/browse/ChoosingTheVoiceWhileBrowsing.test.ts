import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
  });

  when("they switch the voice and play a card", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.switchVoice();
      await webApp.browse.play("물");
    });

    then("it is the male voice at normal speed", async ({webApp}) => {
      const [recording] = await webApp.review.sound.getRecordingsPlayed();

      expect(recording).toMatchObject({voice: "male", speed: "normal"});
    });
  });

  when("they switch the speed and play a card", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.switchSpeed();
      await webApp.browse.play("물");
    });

    then("it is the female voice, slower", async ({webApp}) => {
      const [recording] = await webApp.review.sound.getRecordingsPlayed();

      expect(recording).toMatchObject({voice: "female", speed: "slower"});
    });
  });

  when("they switch the voice and go to the settings", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.switchVoice();
      await webApp.browse.close();
      await webApp.home.openSettings();
    });

    then("the male voice is the one chosen there, because it is one setting", async ({webApp}) => {
      expect(await webApp.settings.voice.getVoice()).toBe("male");
    });
  });
});
