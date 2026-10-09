import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has just started reviewing the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.setAudioFill(true);
    await webApp.settings.close();
    await webApp.home.startReviewing();
  });

  then("the screen filled once, as the card's word began to play", async ({webApp}) => {
    await expect.poll(async () => await webApp.review.sound.getFillsShown()).toBe(1);
  });

  when("they replay the word", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.sound.replay();
    });

    then("the screen fills again", async ({webApp}) => {
      await expect.poll(async () => await webApp.review.sound.getFillsShown()).toBe(2);
    });
  });
});
