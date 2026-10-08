# Daily-goal reminder

A notification on the learner's device when the daily goal has not been reached by an hour they choose (eight in the evening to start
with). A closed PWA cannot fire a timed notification, so the API's Worker pushes it: each device subscribes to the browser's push
service, the Worker keeps where to push and at what hour, and an hourly cron trigger sends the pushes that are due.

## The parts

- **Settings** (`reminderEnabled`, `reminderHour`, `webapp/src/redux/slices/settings/`): kept on the device and **not synced**. A push
  subscription belongs to one browser, so a laptop with the reminder on says nothing about a phone.
- **Turning it on** (`applyReminder`): asks the learner to allow notifications, subscribes with the API's public key
  (`GET /api/reminders/key`) and tells the API the push address, the hour and the device's time zone
  (`PUT /api/reminders/subscription`). Moving the hour sends the same again. Turning it off unsubscribes and tells the API
  (`DELETE`). Where the learner says no, or the API cannot be reached, the setting goes back to off rather than say what is not so.
  The control is hidden where the browser cannot be pushed to (an iPhone's browser, outside an installed app).
- **Goal reached** (`POST /api/reminders/goal-met`): when an answer brings the day's different cards to the goal and the reminder is
  on, the app tells the API the study day. The server never recomputes the goal from card events, which keeps it ignorant of
  scheduling. The cost is that it trusts the device, and that a device which was offline when the goal was reached may still be
  reminded. A reminder switched on after the goal was reached that day will also still come that day.
- **The cron** (`api/src/reminders/`, hourly on the hour): for each subscription, `isReminderDue` says whether the learner's own
  local hour is the chosen one and neither the goal nor an earlier reminder has covered today's **study day** (`studyDayOf`, which
  rolls over at four in the morning, as `docs/scheduling.md` does). A 404 or 410 from the push service drops the subscription.
- **The push** carries no message. The service worker (`webapp/src/sw/reminders/`) shows "Your daily goal is waiting." for every
  push, one notification replacing the last, and a tap brings the app forward. That avoids encrypting a payload (RFC 8291) and any
  need for the Worker to know a card count.
- **Signing**: VAPID (RFC 8292), an ES256 token on WebCrypto (`reminders/vapid/VapidAuthorization.ts`), so no library is needed.
  The key pair comes from `pnpm --filter @flashcards/api vapid-keys` (`MANUAL-SETUP-STEPS.md` 4f).

## Limits

- The push address must be https, since the Worker posts to it.
- A new key pair makes every subscription useless until the reminder is turned off and on again.
- Not tried on a real phone yet: the acceptance specs fake the push service (`fake-push/`), and the cron is covered by unit tests with
  `fetch` stubbed.
