import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing the first card of the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("the card has no picture", async ({webApp}) => {
    expect(await webApp.review.memoryAid.isPictureShown()).toBe(false);
  });

  when("they add a picture far larger than a card needs", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.memoryAid.addVeryLargePicture();
    });

    then("it is kept at a size that fits, at most 1280 pixels wide, rather than as it was", async ({webApp}) => {
      const width = await webApp.review.memoryAid.getPictureWidth();

      expect(width).toBeGreaterThan(0);
      expect(width).toBeLessThanOrEqual(1280);
    });
  });

  when("they add a picture from their files", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.memoryAid.addPicture();
    });

    then("the picture is shown on the card", async ({webApp}) => {
      expect(await webApp.review.memoryAid.isPictureShown()).toBe(true);
    });

    when("they answer it and the next card is shown", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.rate("again");
      });

      then("the next card has no picture", async ({webApp}) => {
        expect(await webApp.review.memoryAid.isPictureShown()).toBe(false);
      });
    });

    when("they reopen the app and start reviewing again", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
        await webApp.home.startReviewing();
      });

      then("the picture is still on the card", async ({webApp}) => {
        expect(await webApp.review.memoryAid.isPictureShown()).toBe(true);
      });
    });

    when("they remove the picture", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.memoryAid.removePicture();
      });

      then("the card has no picture", async ({webApp}) => {
        expect(await webApp.review.memoryAid.isPictureShown()).toBe(false);
      });
    });
  });

  when("they paste a picture", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.memoryAid.pastePicture();
    });

    then("the picture is shown on the card", async ({webApp}) => {
      expect(await webApp.review.memoryAid.isPictureShown()).toBe(true);
    });
  });

  when("they choose a file that is not a picture", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.memoryAid.addTextFileAsPicture();
    });

    then("they are told it is not a picture and the card has none", async ({webApp}) => {
      expect(await webApp.review.memoryAid.getPictureError()).toBe("That file is not a picture.");
      expect(await webApp.review.memoryAid.isPictureShown()).toBe(false);
    });
  });
});
