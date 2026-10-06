import {integer, primaryKey, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {users} from "@src/database/schema/Users";

// The similar words a learner asked for, kept with the word (note) they were asked on. A word is on a note once.
export const similarWords = sqliteTable(
  "similar_words",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),
    noteId: text("note_id").notNull(),
    text: text("text").notNull(),
    addedAt: integer("added_at", {mode: "timestamp"}).notNull(),
  },
  table => [primaryKey({columns: [table.userId, table.noteId, table.text]})],
);
