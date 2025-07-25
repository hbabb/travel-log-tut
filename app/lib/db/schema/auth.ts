import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: integer({ mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text(),
  createdAt: integer().notNull().$default(() => Date.now()),
  updatedAt: integer().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const session = sqliteTable("session", {
  id: int().primaryKey({ autoIncrement: true }),
  expiresAt: integer().notNull(),
  token: text().notNull().unique(),
  createdAt: integer().notNull(),
  updatedAt: integer().notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: int()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: int().primaryKey({ autoIncrement: true }),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: int()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: integer(),
  refreshTokenExpiresAt: integer(),
  scope: text(),
  password: text(),
  createdAt: integer().notNull().$default(() => Date.now()),
  updatedAt: integer().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const verification = sqliteTable("verification", {
  id: int().primaryKey({ autoIncrement: true }),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer().notNull(),
  createdAt: integer().$default(() => Date.now()),
  updatedAt: integer().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
