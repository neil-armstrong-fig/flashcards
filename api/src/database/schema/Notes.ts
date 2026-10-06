import {integer, primaryKey, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {users} from "@src/database/schema/Users";

// The cards a learner made themselves, one row a word. Each becomes two cards in the app (both directions).
export const notes = sqliteTable(
  "notes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),
    id: text("id").notNull(),
    word: text("word").notNull(),
    meaning: text("meaning").notNull(),
    romanisation: text("romanisation").notNull(),
    addedAt: integer("added_at", {mode: "timestamp"}).notNull(),
  },
  table => [primaryKey({columns: [table.userId, table.id]})],
);
