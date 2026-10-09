import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the settings", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
  });

  then("every deck starts with the male voice at normal speed", async ({webApp}) => {
    expect(await webApp.settings.voice.getDeckVoice("ko-starter")).toBe("male");
    expect(await webApp.settings.voice.getDeckSpeed("ko-starter")).toBe("normal");
    expect(await webApp.settings.voice.getDeckVoice("ja-hiragana")).toBe("male");
    expect(await webApp.settings.voice.getDeckSpeed("ja-katakana")).toBe("normal");
  });

  when("they choose the female voice and slower speed for the hiragana deck and go back", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.voice.chooseDeckVoice("ja-hiragana", "female");
      await webApp.settings.voice.chooseDeckSpeed("ja-hiragana", "slower");
      await webApp.settings.close();
    });

    when("they review the hiragana deck", () => {
      beforeEach(async ({webApp}) => {
        await webApp.home.startReviewing("ja-hiragana");
        await webApp.review.showAnswer();
      });

      then("it is spoken by the female voice, slower", async ({webApp}) => {
        const [recording] = await webApp.review.sound.getRecordingsPlayed();

        expect(recording).toMatchObject({language: "ja", voice: "female", speed: "slower", found: true});
      });
    });

    when("they reopen the app and review the hiragana deck", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
        await webApp.home.startReviewing("ja-hiragana");
        await webApp.review.showAnswer();
      });

      then("the choice was kept", async ({webApp}) => {
        const [recording] = await webApp.review.sound.getRecordingsPlayed();

        expect(recording).toMatchObject({voice: "female", speed: "slower"});
      });
    });

    when("they review the starter deck", () => {
      beforeEach(async ({webApp}) => {
        await webApp.home.startReviewing();
      });

      then("it is still the male voice at normal speed", async ({webApp}) => {
        const [recording] = await webApp.review.sound.getRecordingsPlayed();

        expect(recording).toMatchObject({language: "ko", voice: "male", speed: "normal", found: true});
      });
    });
  });
});

given("the learner chooses the female voice for the starter deck and reviews it", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.voice.chooseDeckVoice("ko-starter", "female");
    await webApp.settings.close();
    await webApp.home.startReviewing();
    await webApp.review.showAnswer();
  });

  then("the English is still the female voice at normal speed", async ({webApp}) => {
    const [, english] = await webApp.review.sound.getRecordingsPlayed();

    expect(english).toMatchObject({language: "en", voice: "female", speed: "normal", found: true});
  });
});

given("the learner is reviewing the starter deck and switches to the female voice on the card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.sound.switchVoice();
  });

  when("they leave and review the hiragana deck", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.leaveSession();
      await webApp.home.startReviewing("ja-hiragana");
      await webApp.review.showAnswer();
    });

    then("that deck is still the male voice", async ({webApp}) => {
      const recordings = await webApp.review.sound.getRecordingsPlayed();

      expect(recordings.at(-1)).toMatchObject({language: "ja", voice: "male", found: true});
    });
  });

  when("they open the settings", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.leaveSession();
      await webApp.home.openSettings();
    });

    then("the starter deck shows the voice they switched to", async ({webApp}) => {
      expect(await webApp.settings.voice.getDeckVoice("ko-starter")).toBe("female");
    });
  });
});
