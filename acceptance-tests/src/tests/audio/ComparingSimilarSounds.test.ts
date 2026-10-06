import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is on a card for 물, which sounds like 불 to them", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("comparing is not offered while the front is showing, so as not to give the answer away", async ({webApp}) => {
    expect(await webApp.review.similar.canOpen()).toBe(false);
  });

  when("the answer is shown and they open the similar", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
      await webApp.review.similar.open();
    });

    then("comparing is offered", async ({webApp}) => {
      expect(await webApp.review.similar.canOpen()).toBe(true);
    });

    then("a similar is already there to try, 불", async ({webApp}) => {
      expect(await webApp.review.similar.getWords()).toEqual(["불"]);
    });

    when("they play the similar", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.similar.play("불");
      });

      then("it is a different recording from the card's own word, in the same voice and speed", async ({webApp}) => {
        const [own, , similar] = await webApp.review.sound.getRecordingsPlayed();

        expect(similar).toMatchObject({language: "ko", voice: "male", speed: "normal", found: true});
        expect(similar?.file).not.toBe(own?.file);
      });
    });

    when("they play the card's own word", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.similar.playOwn();
      });

      then("it is the recording they heard when the card came up", async ({webApp}) => {
        const [first, , second] = await webApp.review.sound.getRecordingsPlayed();

        expect(second?.file).toBe(first?.file);
      });
    });

    when("they play both, one after the other", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.similar.playBoth("불");
      });

      then("the card's word is heard first and the similar second", async ({webApp}) => {
        const [first, , own, similar] = await webApp.review.sound.getRecordingsPlayed();

        expect(own?.file).toBe(first?.file);
        expect(similar?.file).not.toBe(first?.file);
      });
    });

    when("they switch to the female voice and play the similar", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.similar.switchVoice();
        await webApp.review.similar.play("불");
      });

      then("it is the female recording", async ({webApp}) => {
        const recordings = await webApp.review.sound.getRecordingsPlayed();

        expect(recordings.at(-1)).toMatchObject({voice: "female", found: true});
      });
    });
  });
});

given("the learner is on a card for a word with no similars", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
    await webApp.review.showAnswer();
    await webApp.review.similar.open();
  });

  then("there is nothing to try until they add one", async ({webApp}) => {
    expect(await webApp.review.similar.getWords()).toEqual([]);
  });
});
