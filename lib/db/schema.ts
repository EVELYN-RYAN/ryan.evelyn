import { pgTable, serial, text, varchar, timestamp, real, uniqueIndex, index } from "drizzle-orm/pg-core";

export const kudos = pgTable(
  "kudos",
  {
    id: serial("id").primaryKey(),
    itemId: varchar("item_id", { length: 128 }).notNull(),
    visitorToken: varchar("visitor_token", { length: 64 }).notNull(),
    ipHash: varchar("ip_hash", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("kudos_item_visitor_uniq").on(t.itemId, t.visitorToken),
    index("kudos_item_idx").on(t.itemId),
  ],
);

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  projectId: varchar("project_id", { length: 128 }),
  ipHash: varchar("ip_hash", { length: 64 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: serial("id").primaryKey(),
    sessionId: varchar("session_id", { length: 64 }).notNull(),
    eventType: varchar("event_type", { length: 16 }).notNull(), // "click" | "scroll" | "dwell"
    page: varchar("page", { length: 256 }).notNull(),
    section: varchar("section", { length: 128 }),
    elementId: varchar("element_id", { length: 128 }),
    x: real("x"),
    y: real("y"),
    scrollDepth: real("scroll_depth"),
    country: varchar("country", { length: 64 }),
    city: varchar("city", { length: 128 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("analytics_session_idx").on(t.sessionId),
    index("analytics_type_idx").on(t.eventType),
    index("analytics_created_idx").on(t.createdAt),
  ],
);

export const rateLimitHits = pgTable(
  "rate_limit_hits",
  {
    id: serial("id").primaryKey(),
    bucket: varchar("bucket", { length: 64 }).notNull(),
    key: varchar("key", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("rate_limit_bucket_key_idx").on(t.bucket, t.key)],
);
