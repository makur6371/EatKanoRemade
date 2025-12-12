import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Events table - stores Putin's historical footprints and visits
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  year: int("year").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["domestic", "international", "speech", "ceremony", "military", "diplomatic"]).notNull(),
  latitude: varchar("latitude", { length: 20 }).notNull(),
  longitude: varchar("longitude", { length: 20 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }),
  significance: int("significance").default(5), // 1-10 scale
  videoUrl: varchar("videoUrl", { length: 512 }),
  imageUrl: varchar("imageUrl", { length: 512 }),
  sources: text("sources"), // JSON array of source URLs
  verified: boolean("verified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Bullet screen comments - stores user comments in multiple languages
export const bulletComments = mysqlTable("bulletComments", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").references(() => events.id),
  userId: int("userId").references(() => users.id),
  text: text("text").notNull(),
  language: mysqlEnum("language", ["zh", "ru", "en"]).default("zh").notNull(),
  color: varchar("color", { length: 7 }).default("#FFFFFF"),
  fontSize: int("fontSize").default(16),
  duration: int("duration").default(8), // seconds
  likes: int("likes").default(0),
  verified: boolean("verified").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BulletComment = typeof bulletComments.$inferSelect;
export type InsertBulletComment = typeof bulletComments.$inferInsert;

// Statistics - stores aggregated data for visualization
export const statistics = mysqlTable("statistics", {
  id: int("id").autoincrement().primaryKey(),
  year: int("year").notNull().unique(),
  totalFlightDistance: int("totalFlightDistance").default(0), // km
  countriesVisited: int("countriesVisited").default(0),
  domesticVisits: int("domesticVisits").default(0),
  internationalVisits: int("internationalVisits").default(0),
  handshakesCount: int("handshakesCount").default(0),
  speechesCount: int("speechesCount").default(0),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Statistic = typeof statistics.$inferSelect;
export type InsertStatistic = typeof statistics.$inferInsert;