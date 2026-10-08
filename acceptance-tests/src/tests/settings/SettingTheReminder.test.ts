import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the settings", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
  });

  then("the reminder is off", async ({webApp}) => {
    expect(await webApp.settings.reminder.isOn()).toBe(false);
  });

  then("the API holds no reminder", async ({webApp}) => {
    expect(await webApp.settings.reminder.getHourHeldByTheApi()).toBeUndefined();
  });

  when("they turn the reminder on", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.reminder.turnOn();
    });

    then("it is set for eight in the evening", async ({webApp}) => {
      expect(await webApp.settings.reminder.getHour()).toBe(20);
    });

    then("the API holds the reminder for eight in the evening", async ({webApp}) => {
      await expect.poll(() => webApp.settings.reminder.getHourHeldByTheApi()).toBe(20);
    });

    when("they move it to six and reopen the app", () => {
      beforeEach(async ({webApp}) => {
        await webApp.settings.reminder.chooseHour(18);
        await expect.poll(() => webApp.settings.reminder.getHourHeldByTheApi()).toBe(18);
        await webApp.reload();
        await webApp.home.openSettings();
      });

      then("the reminder is still on, for six", async ({webApp}) => {
        expect(await webApp.settings.reminder.isOn()).toBe(true);
        expect(await webApp.settings.reminder.getHour()).toBe(18);
      });
    });

    when("they turn it off again", () => {
      beforeEach(async ({webApp}) => {
        await webApp.settings.reminder.turnOff();
      });

      then("the API holds no reminder", async ({webApp}) => {
        await expect.poll(() => webApp.settings.reminder.getHourHeldByTheApi()).toBeUndefined();
      });
    });
  });
});
