import { z } from "zod";
import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userRelations = relations(usersTable, ({ many }) => ({
  apiKeys: many(apikeysTable),
}));

export const userSchema = createInsertSchema(usersTable);

export type UserType = z.infer<typeof userSchema>;

export const apikeysTable = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  userId: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true).notNull(),
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const apiKeysRelations = relations(apikeysTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [apikeysTable.userId],
    references: [usersTable.id],
  }),
}));

export const apiKeySchema = createInsertSchema(apikeysTable);

export type ApiKeyType = z.infer<typeof apiKeySchema>;
