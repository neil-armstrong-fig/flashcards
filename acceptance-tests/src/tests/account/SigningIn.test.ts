import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has signed in with Google", () => {
  then("they are in the app, not on the sign-in screen", async ({webApp}) => {
    expect(await webApp.login.isShown()).toBe(false);
    expect(await webApp.home.getCardsDueToday()).toBe(20);
  });

  when("they open the settings", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.openSettings();
    });

    then("they are shown as signed in, with their email", async ({webApp}) => {
      expect(await webApp.settings.account.isSignedIn()).toBe(true);
      expect(await webApp.settings.account.getSignedInEmail()).toBe("learner@example.com");
    });

    when("they sign out", () => {
      beforeEach(async ({webApp}) => {
        await webApp.settings.account.signOut();
      });

      then("the app is closed to them: only the sign-in screen is shown", async ({webApp}) => {
        expect(await webApp.login.isShown()).toBe(true);
        expect(await webApp.login.canReachTheApp()).toBe(false);
      });

      when("they reopen the app", () => {
        beforeEach(async ({webApp}) => {
          await webApp.reload();
        });

        then("it is still closed to them", async ({webApp}) => {
          expect(await webApp.login.isShown()).toBe(true);
          expect(await webApp.login.canReachTheApp()).toBe(false);
        });
      });

      when("they sign in again", () => {
        beforeEach(async ({webApp}) => {
          await webApp.login.signIn();
        });

        then("the app opens, with their progress where they left it", async ({webApp}) => {
          expect(await webApp.login.isShown()).toBe(false);
          expect(await webApp.home.getCardsDueToday()).toBe(20);
        });
      });
    });
  });

  when("they answer a card, sign out and sign in again", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.startReviewing();
      await webApp.review.rate("easy");
      await webApp.reload();
      await webApp.home.openSettings();
      await webApp.settings.account.signOut();
      await webApp.login.signIn();
    });

    then("what they answered is still kept on the device", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(19);
    });
  });
});
