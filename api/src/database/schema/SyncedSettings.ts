import {primaryKey, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {users} from "@src/database/schema/Users";

// The settings that follow a learner to every device, one row a setting, the value as JSON. A row only ever changes to a later
// choice (`at`): the server keeps what a device chose and never reads the value.
export const syncedSettings = sqliteTable(
  "synced_settings",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    value: text("value").notNull(),
    at: text("at").notNull(),
  },
  table => [primaryKey({columns: [table.userId, table.name]})],
);
