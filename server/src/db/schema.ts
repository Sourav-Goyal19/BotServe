import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  apiKey: text("api_key"),
});
