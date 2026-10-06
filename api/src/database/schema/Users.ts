import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

// Google is the only provider, so its stable subject id sits on the user. The email is kept because the API is a private test app
// and shows who is signed in; nothing else about the person is.
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  googleSub: text("google_sub").notNull().unique(),
  email: text("email").notNull(),
  createdAt: integer("created_at", {mode: "timestamp"}).notNull(),
});
