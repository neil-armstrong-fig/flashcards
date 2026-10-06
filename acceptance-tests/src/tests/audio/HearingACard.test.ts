import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const WORDS_IN_THE_STARTER_DECK = 10;

given("the learner starts reviewing the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("the Korean word on the card is spoken once, before the answer is asked for", async ({webApp}) => {
    expect(await webApp.review.sound.getRecordingsPlayed()).toHaveLength(1);
    expect(await webApp.review.isAnswerShown()).toBe(false);
  });

  then("it is spoken by the male voice at normal speed", async ({webApp}) => {
    const [recording] = await webApp.review.sound.getRecordingsPlayed();

    expect(recording).toMatchObject({language: "ko", voice: "male", speed: "normal", found: true});
  });

  when("they replay it", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.sound.replay();
    });

    then("the same recording plays again", async ({webApp}) => {
      const [first, second] = await webApp.review.sound.getRecordingsPlayed();

      expect(second?.file).toBe(first?.file);
    });
  });

  when("they tap the card rather than a button", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.sound.tapTheCard();
    });

    then("the same recording plays again", async ({webApp}) => {
      const [first, second] = await webApp.review.sound.getRecordingsPlayed();

      expect(second?.file).toBe(first?.file);
    });
  });

  when("the answer is shown", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("the English answer is spoken", async ({webApp}) => {
      const recordings = await webApp.review.sound.getRecordingsPlayed();

      expect(recordings).toHaveLength(2);
      expect(recordings[1]).toMatchObject({language: "en", found: true});
    });

    when("they replay it", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.sound.replay();
      });

      then("the English answer is heard again", async ({webApp}) => {
        const [, first, second] = await webApp.review.sound.getRecordingsPlayed();

        expect(second?.file).toBe(first?.file);
      });
    });

    when("the card is rated", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.rate("easy");
      });

      then("the next Korean word is spoken", async ({webApp}) => {
        const [first, , third] = await webApp.review.sound.getRecordingsPlayed();

        expect(third).toMatchObject({language: "ko"});
        expect(third?.file).not.toBe(first?.file);
      });
    });
  });

  when("every Korean word has been rated easy", () => {
    beforeEach(async ({webApp}) => {
      for (let answered = 0; answered < WORDS_IN_THE_STARTER_DECK; answered += 1) {
        await webApp.review.rate("easy");
      }
    });

    then(
      "the English card speaks the English word, the same recording as on its other card's answer",
      async ({webApp}) => {
        const recordings = await webApp.review.sound.getRecordingsPlayed();

        expect(await webApp.review.getFrontText()).toBe("water");
        expect(recordings.at(-1)).toMatchObject({language: "en", voice: "female", speed: "normal"});
        expect(recordings.at(-1)?.file).toBe(recordings[1]?.file);
      },
    );

    when("its answer is shown", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.showAnswer();
      });

      then("the Korean word is spoken, the same recording as on its other card", async ({webApp}) => {
        const recordings = await webApp.review.sound.getRecordingsPlayed();

        expect(recordings.at(-1)).toMatchObject({language: "ko"});
        expect(recordings.at(-1)?.file).toBe(recordings[0]?.file);
      });
    });
  });
});
