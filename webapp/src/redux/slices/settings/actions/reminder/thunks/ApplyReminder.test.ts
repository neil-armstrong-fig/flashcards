import {applyReminder} from "@src/redux/slices/settings/actions/reminder/thunks/ApplyReminder";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";
import {reminderEnabledChosen, reminderHourChosen} from "@src/redux/slices/settings/SettingsSlice";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    timeZone: "Europe/London",
  } as Intl.ResolvedDateTimeFormatOptions);
});

it("tells the API where to push and at what hour when the reminder is turned on", async () => {
  const {store, reminders} = await openedStudyStore();

  store.dispatch(reminderEnabledChosen(true));
  await store.dispatch(applyReminder());

  expect(reminders.held).toEqual({
    endpoint: "https://push.example.test/send/test-device",
    hour: 20,
    timeZone: "Europe/London",
  });
});

it("moves the hour the API holds when the learner moves the reminder", async () => {
  const {store, reminders} = await openedStudyStore();
  store.dispatch(reminderEnabledChosen(true));
  await store.dispatch(applyReminder());

  store.dispatch(reminderHourChosen(18));
  await store.dispatch(applyReminder());

  expect(reminders.held?.hour).toBe(18);
});

it("unsubscribes and tells the API to forget the device when the reminder is turned off", async () => {
  const {store, reminders} = await openedStudyStore();
  store.dispatch(reminderEnabledChosen(true));
  await store.dispatch(applyReminder());

  store.dispatch(reminderEnabledChosen(false));
  await store.dispatch(applyReminder());

  expect(reminders.subscribedEndpoint).toBeUndefined();
  expect(reminders.held).toBeUndefined();
});

it("turns the reminder back off where the learner will not allow notifications", async () => {
  const {store, reminders} = await openedStudyStore();
  reminders.allowed = false;

  store.dispatch(reminderEnabledChosen(true));
  await store.dispatch(applyReminder());

  expect(store.getState().settings.reminderEnabled).toBe(false);
  expect(reminders.held).toBeUndefined();
});

it("turns the reminder back off where the API cannot be reached", async () => {
  const {store, reminders} = await openedStudyStore();
  reminders.unreachable = true;

  store.dispatch(reminderEnabledChosen(true));
  await store.dispatch(applyReminder());

  expect(store.getState().settings.reminderEnabled).toBe(false);
});
