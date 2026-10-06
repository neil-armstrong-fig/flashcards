import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has just heard a Korean word on a card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("they can switch the voice and the speed", async ({webApp}) => {
    expect(await webApp.review.sound.canSwitchVoice()).toBe(true);
    expect(await webApp.review.sound.canSwitchSpeed()).toBe(true);
  });

  when("they switch the voice", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.sound.switchVoice();
    });

    then("the word is spoken again by the female voice at the same speed", async ({webApp}) => {
      const [, second] = await webApp.review.sound.getRecordingsPlayed();

      expect(second).toMatchObject({language: "ko", voice: "female", speed: "normal", found: true});
    });

    when("they switch it again", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.sound.switchVoice();
      });

      then("the male voice is back", async ({webApp}) => {
        const [first, , third] = await webApp.review.sound.getRecordingsPlayed();

        expect(third?.file).toBe(first?.file);
      });
    });

    when("they reopen the app and start reviewing", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
        await webApp.home.startReviewing();
      });

      then("the female voice is the one they hear, because the switch was kept", async ({webApp}) => {
        const [recording] = await webApp.review.sound.getRecordingsPlayed();

        expect(recording).toMatchObject({voice: "female"});
      });
    });

    when("they open the settings afterwards", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
        await webApp.home.openSettings();
      });

      then("the female voice is the one chosen for the starter deck there", async ({webApp}) => {
        expect(await webApp.settings.voice.getDeckVoice("ko-starter")).toBe("female");
      });
    });
  });

  when("they switch the speed", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.sound.switchSpeed();
    });

    then("the word is spoken again by the same voice, slower", async ({webApp}) => {
      const [, second] = await webApp.review.sound.getRecordingsPlayed();

      expect(second).toMatchObject({language: "ko", voice: "male", speed: "slower", found: true});
    });

    when("they switch the voice too", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.sound.switchVoice();
      });

      then("the female voice is heard, slower", async ({webApp}) => {
        const [, , third] = await webApp.review.sound.getRecordingsPlayed();

        expect(third).toMatchObject({voice: "female", speed: "slower"});
      });
    });
  });

  when("the answer is shown, and it is spoken in English", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("there is no voice or speed to switch", async ({webApp}) => {
      expect(await webApp.review.sound.canSwitchVoice()).toBe(false);
      expect(await webApp.review.sound.canSwitchSpeed()).toBe(false);
    });
  });
});
