import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing the first card of the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  then("they are not prompted to add a note or picture", async ({webApp}) => {
    expect(await webApp.review.memoryAid.isPromptedToAddAMemoryAid()).toBe(false);
  });

  when("they say the card is hard", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.struggling.markHard();
    });

    then("they are prompted to add a note or picture", async ({webApp}) => {
      expect(await webApp.review.memoryAid.isPromptedToAddAMemoryAid()).toBe(true);
    });

    when("they add a note", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.memoryAid.addNote("Sounds like mule");
      });

      then("they are no longer prompted", async ({webApp}) => {
        expect(await webApp.review.memoryAid.isPromptedToAddAMemoryAid()).toBe(false);
      });
    });

    when("they add a picture", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.memoryAid.addPicture();
      });

      then("they are no longer prompted", async ({webApp}) => {
        expect(await webApp.review.memoryAid.isPromptedToAddAMemoryAid()).toBe(false);
      });
    });
  });
});
