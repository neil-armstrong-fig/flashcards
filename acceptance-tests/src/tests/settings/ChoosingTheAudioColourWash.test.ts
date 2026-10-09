import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the settings on a new device", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
  });

  then("the audio colour wash starts on for a touch device and off otherwise", async ({webApp}) => {
    expect(await webApp.settings.isAudioFillOn()).toBe(await webApp.isTouchDevice());
  });

  when("they turn the audio colour wash on and reopen the app", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.setAudioFill(true);
      await webApp.reload();
      await webApp.home.openSettings();
    });

    then("it is still on", async ({webApp}) => {
      expect(await webApp.settings.isAudioFillOn()).toBe(true);
    });
  });

  when("they turn the audio colour wash off and start reviewing", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.setAudioFill(false);
      await webApp.settings.close();
      await webApp.home.startReviewing();
    });

    then("the recording begins without filling the screen", async ({webApp}) => {
      expect(await webApp.review.sound.getRecordingsPlayed()).toHaveLength(1);
      expect(await webApp.review.sound.getFillsShown()).toBe(0);
    });
  });

  when("they turn the audio colour wash off and reopen the app", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.setAudioFill(false);
      await webApp.reload();
      await webApp.home.openSettings();
    });

    then("it is still off", async ({webApp}) => {
      expect(await webApp.settings.isAudioFillOn()).toBe(false);
    });
  });
});
