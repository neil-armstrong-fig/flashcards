import {index, integer, sqliteTable, text, uniqueIndex} from "drizzle-orm/sqlite-core";
import {users} from "@src/database/schema/Users";

// What a learner made, one row a thing: their own cards, the similar words they added, and the notes and pictures on their cards
// (`docs/sync.md`). A row only ever changes to a later change (`at`), and when it does it takes the next `seq`, which is how a device
// asks for just what changed since it last looked. A removal stays as a row with `deleted` set, so a device that has not heard of
// it is told. The payload is JSON the app wrote and the server checked (`readRecordChange`); the server never reads it otherwise.
export const syncedRecords = sqliteTable(
  "synced_records",
  {
    seq: integer("seq").primaryKey({autoIncrement: true}),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),
    kind: text("kind").notNull(),
    id: text("id").notNull(),
    at: text("at").notNull(),
    deleted: integer("deleted", {mode: "boolean"}).notNull(),
    payload: text("payload"),
  },
  table => [
    uniqueIndex("synced_records_identity").on(table.userId, table.kind, table.id),
    index("synced_records_by_account").on(table.userId, table.seq),
  ],
);
