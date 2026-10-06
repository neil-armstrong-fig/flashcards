import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the settings", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
  });

  then("they start with the female voice at normal speed", async ({webApp}) => {
    expect(await webApp.settings.voice.getVoice()).toBe("female");
    expect(await webApp.settings.voice.getSpeed()).toBe("normal");
  });

  when("they choose the male voice and slower speed and go back", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.voice.chooseVoice("male");
      await webApp.settings.voice.chooseSpeed("slower");
      await webApp.settings.close();
    });

    when("they start reviewing", () => {
      beforeEach(async ({webApp}) => {
        await webApp.home.startReviewing();
      });

      then("the male voice is played, slower", async ({webApp}) => {
        const [recording] = await webApp.review.sound.getRecordingsPlayed();

        expect(recording).toMatchObject({language: "ko", voice: "male", speed: "slower", found: true});
      });

      when("the answer is shown", () => {
        beforeEach(async ({webApp}) => {
          await webApp.review.showAnswer();
        });

        then("the English is still the female voice at normal speed", async ({webApp}) => {
          const [, english] = await webApp.review.sound.getRecordingsPlayed();

          expect(english).toMatchObject({language: "en", voice: "female", speed: "normal", found: true});
        });
      });
    });

    when("they reopen the app and start reviewing", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
        await webApp.home.startReviewing();
      });

      then("the choice was kept", async ({webApp}) => {
        const [recording] = await webApp.review.sound.getRecordingsPlayed();

        expect(recording).toMatchObject({voice: "male", speed: "slower"});
      });
    });
  });
});
