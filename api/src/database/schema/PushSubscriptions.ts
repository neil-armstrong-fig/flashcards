import {integer, primaryKey, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {users} from "@src/database/schema/Users";

// The devices to remind, one row a device (the push service's address for it). `hour` is the hour of the learner's own day, in
// `time_zone`. `goal_met_on` and `last_sent_on` are study days (`YYYY-MM-DD`, rolling over at four in the morning) and so decide
// whether a reminder is still wanted today (`reminders/due/IsReminderDue.ts`). Nothing about the push is kept but where to send it.
export const pushSubscriptions = sqliteTable(
  "push_subscriptions",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),
    endpoint: text("endpoint").notNull(),
    hour: integer("hour").notNull(),
    timeZone: text("time_zone").notNull(),
    goalMetOn: text("goal_met_on"),
    lastSentOn: text("last_sent_on"),
  },
  table => [primaryKey({columns: [table.userId, table.endpoint]})],
);
