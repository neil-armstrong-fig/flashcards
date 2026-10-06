import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is on a card for 물 with the answer shown, and opens the similar", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.showAnswer();
    await webApp.review.similar.open();
  });

  then("they can add a word", async ({webApp}) => {
    expect(await webApp.review.similar.canAdd()).toBe(true);
  });

  when("they ask for 볼, which they keep mishearing it as", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.similar.add("볼");
    });

    then("it is offered beside the similar that was already there", async ({webApp}) => {
      expect(await webApp.review.similar.getWords()).toEqual(["불", "볼"]);
    });

    when("they play it", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.similar.play("볼");
      });

      then("a recording of it is heard", async ({webApp}) => {
        const recordings = await webApp.review.sound.getRecordingsPlayed();

        expect(recordings.at(-1)).toMatchObject({language: "ko", voice: "female", speed: "normal", found: true});
      });
    });

    when("they switch to the male voice and slower, then play it", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.similar.switchVoice();
        await webApp.review.similar.switchSpeed();
        await webApp.review.similar.play("볼");
      });

      then("it is there in that voice and speed too, because every version was kept", async ({webApp}) => {
        const recordings = await webApp.review.sound.getRecordingsPlayed();

        expect(recordings.at(-1)).toMatchObject({voice: "male", speed: "slower", found: true});
      });
    });

    when("they lose their connection and reopen the app on the same card", () => {
      beforeEach(async ({webApp}) => {
        await webApp.goOffline();
        await webApp.reload();
        await webApp.home.startReviewing();
        await webApp.review.showAnswer();
        await webApp.review.similar.open();
        await webApp.review.similar.play("볼");
      });

      then("it is still there, and still plays", async ({webApp}) => {
        const recordings = await webApp.review.sound.getRecordingsPlayed();

        expect(await webApp.review.similar.getWords()).toEqual(["불", "볼"]);
        expect(recordings.at(-1)).toMatchObject({language: "ko", found: true});
      });
    });

    when("they see the same word's card in English", () => {
      beforeEach(async ({webApp}) => {
        for (let answered = 0; answered < 10; answered += 1) {
          await webApp.review.rate("easy");
        }
        await webApp.review.showAnswer();
        await webApp.review.similar.open();
      });

      then("it is kept with that card too", async ({webApp}) => {
        expect(await webApp.review.getFrontText()).toBe("water");
        expect(await webApp.review.similar.getWords()).toEqual(["불", "볼"]);
      });
    });

    when("they forget everything this device kept and reopen the app", () => {
      beforeEach(async ({webApp}) => {
        await webApp.forgetThisDevice();
        await webApp.home.startReviewing();
        await webApp.review.showAnswer();
        await webApp.review.similar.open();
      });

      then("it is back, because it was kept for them online", async ({webApp}) => {
        expect(await webApp.review.similar.getWords()).toEqual(["불", "볼"]);
      });

      when("they play it", () => {
        beforeEach(async ({webApp}) => {
          await webApp.review.similar.play("볼");
        });

        then("it plays, its recordings fetched again", async ({webApp}) => {
          const recordings = await webApp.review.sound.getRecordingsPlayed();

          expect(recordings.at(-1)).toMatchObject({language: "ko", found: true});
        });
      });
    });
  });

  when("they ask for something that is not Korean", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.similar.add("water");
    });

    then("it is refused with a message and nothing is added", async ({webApp}) => {
      expect(await webApp.review.similar.getError()).not.toBe("");
      expect(await webApp.review.similar.getWords()).toEqual(["불"]);
    });
  });
});
