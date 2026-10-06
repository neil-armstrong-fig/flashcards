import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has opened the app once and then loses their connection", () => {
  beforeEach(async ({webApp}) => {
    await webApp.goOffline();
  });

  when("they start reviewing", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.startReviewing();
    });

    then("the word is still spoken", async ({webApp}) => {
      const [recording] = await webApp.review.sound.getRecordingsPlayed();

      expect(recording).toMatchObject({voice: "male", speed: "normal", found: true});
    });
  });

  when("they reopen the app", () => {
    beforeEach(async ({webApp}) => {
      await webApp.reload();
      await webApp.home.startReviewing();
    });

    then("the word is still spoken", async ({webApp}) => {
      const [recording] = await webApp.review.sound.getRecordingsPlayed();

      expect(recording).toMatchObject({found: true});
    });
  });
});
