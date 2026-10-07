import {index, integer, real, sqliteTable, text, uniqueIndex} from "drizzle-orm/sqlite-core";
import {users} from "@src/database/schema/Users";

// Everything that happened to a learner's cards, from every device, in the order the server heard of it (`seq`, the cursor a device
// syncs from). A card's state is rebuilt from these by the app (`docs/sync.md`); the server only keeps them and never changes one.
export const cardEvents = sqliteTable(
  "card_events",
  {
    seq: integer("seq").primaryKey({autoIncrement: true}),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, {onDelete: "cascade"}),
    cardId: text("card_id").notNull(),
    at: text("at").notNull(),
    kind: text("kind").notNull(),
    rating: text("rating"),
    retention: real("retention"),
    until: text("until"),
  },
  table => [
    uniqueIndex("card_events_identity").on(table.userId, table.cardId, table.at, table.kind),
    index("card_events_by_account").on(table.userId, table.seq),
  ],
);
