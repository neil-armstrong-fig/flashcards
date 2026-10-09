import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.setAudioFill(true);
    await webApp.settings.close();
    await webApp.home.openBrowse();
  });

  then("no card has filled, as nothing has played", async ({webApp}) => {
    expect(await webApp.review.sound.getFillsShown()).toBe(0);
  });

  when("they play a card", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.play("물");
    });

    then("that card fills once, as the recording starts", async ({webApp}) => {
      await expect.poll(async () => await webApp.review.sound.getFillsShown()).toBe(1);
      expect(await webApp.browse.isCardFilled("물")).toBe(true);
    });

    then("no other card fills", async ({webApp}) => {
      await expect.poll(async () => await webApp.review.sound.getFillsShown()).toBe(1);
      expect(await webApp.browse.isCardFilled("밥")).toBe(false);
    });

    when("they play it again", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.play("물");
      });

      then("the card fills again", async ({webApp}) => {
        await expect.poll(async () => await webApp.review.sound.getFillsShown()).toBe(2);
      });
    });
  });
});
