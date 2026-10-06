import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const THE_NOTE = "Sounds like mule: picture a mule drinking";

given("the learner is reviewing the first card of the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("the card has no note", async ({webApp}) => {
    expect(await webApp.review.memoryAid.getNote()).toBeUndefined();
  });

  when("they add a note to it", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.memoryAid.addNote(THE_NOTE);
    });

    then("the note is shown on the card", async ({webApp}) => {
      expect(await webApp.review.memoryAid.getNote()).toBe(THE_NOTE);
    });

    when("they answer it and the next card is shown", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.rate("again");
      });

      then("the next card has no note", async ({webApp}) => {
        expect(await webApp.review.memoryAid.getNote()).toBeUndefined();
      });
    });

    when("they reopen the app and start reviewing again", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
        await webApp.home.startReviewing();
      });

      then("the note is still on the card", async ({webApp}) => {
        expect(await webApp.review.memoryAid.getNote()).toBe(THE_NOTE);
      });
    });

    when("they remove the note", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.memoryAid.removeNote();
      });

      then("the card has no note", async ({webApp}) => {
        expect(await webApp.review.memoryAid.getNote()).toBeUndefined();
      });
    });
  });
});
