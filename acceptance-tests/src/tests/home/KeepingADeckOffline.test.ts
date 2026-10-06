import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has not kept anything offline", () => {
  then("each deck says how many recordings it has and that none is kept", async ({webApp}) => {
    const status = await webApp.home.getOfflineStatus("ja-hiragana");

    expect(status.total).toBeGreaterThan(0);
    expect(status.kept).toBe(0);
    expect(await webApp.getRecordingsOnThisDevice()).toBe(0);
  });

  when("they keep the hiragana deck offline", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.keepOffline("ja-hiragana");
    });

    then("every recording of the deck is kept on the device, and only that deck's", async ({webApp}) => {
      const hiragana = await webApp.home.getOfflineStatus("ja-hiragana");
      const katakana = await webApp.home.getOfflineStatus("ja-katakana");

      expect(hiragana.kept).toBe(hiragana.total);
      expect(await webApp.getRecordingsOnThisDevice()).toBe(hiragana.total);
      expect(katakana.kept).toBe(0);
    });

    when("they reopen the app", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
      });

      then("the deck is still kept", async ({webApp}) => {
        const status = await webApp.home.getOfflineStatus("ja-hiragana");

        expect(status.kept).toBe(status.total);
      });
    });

    when("they sign out", () => {
      beforeEach(async ({webApp}) => {
        await webApp.home.openSettings();
        await webApp.settings.account.signOut();
      });

      then("the device keeps no recording for whoever uses it next", async ({webApp}) => {
        expect(await webApp.getRecordingsOnThisDevice()).toBe(0);
      });

      when("they sign in again", () => {
        beforeEach(async ({webApp}) => {
          await webApp.login.signIn();
        });

        then("nothing is kept until they ask or play it", async ({webApp}) => {
          expect((await webApp.home.getOfflineStatus("ja-hiragana")).kept).toBe(0);
        });
      });
    });
  });
});

given("the learner studies a card without keeping anything offline", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ja-hiragana");
  });

  then("the recordings they hear are kept as they are played, which is the default", async ({webApp}) => {
    await expect.poll(async () => await webApp.getRecordingsOnThisDevice()).toBeGreaterThan(0);
  });
});
