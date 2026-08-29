import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "./index";
import { analyticsEvents } from "./schema";

export async function clicksByElement(limit = 15) {
  return db
    .select({ elementId: analyticsEvents.elementId, count: sql<number>`count(*)`.as("count") })
    .from(analyticsEvents)
    .where(and(eq(analyticsEvents.eventType, "click"), isNotNull(analyticsEvents.elementId)))
    .groupBy(analyticsEvents.elementId)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

/** Returns a 10-bucket histogram: index i = number of sessions whose max scroll depth fell in [i/10, (i+1)/10). */
export async function scrollDepthBuckets(): Promise<number[]> {
  const rows = await db
    .select({ maxDepth: sql<number>`max(${analyticsEvents.scrollDepth})`.as("max_depth") })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, "scroll"))
    .groupBy(analyticsEvents.sessionId);

  const buckets = new Array(10).fill(0);
  for (const row of rows) {
    const depth = Number(row.maxDepth ?? 0);
    buckets[Math.min(9, Math.max(0, Math.floor(depth * 10)))]++;
  }
  return buckets;
}

export async function dwellPoints(limit = 500) {
  return db
    .select({ x: analyticsEvents.x, y: analyticsEvents.y, section: analyticsEvents.section })
    .from(analyticsEvents)
    .where(eq(analyticsEvents.eventType, "dwell"))
    .orderBy(desc(analyticsEvents.createdAt))
    .limit(limit);
}

export async function geoBreakdown(limit = 20) {
  return db
    .select({
      country: analyticsEvents.country,
      visitors: sql<number>`count(distinct ${analyticsEvents.sessionId})`.as("visitors"),
    })
    .from(analyticsEvents)
    .where(isNotNull(analyticsEvents.country))
    .groupBy(analyticsEvents.country)
    .orderBy(desc(sql`count(distinct ${analyticsEvents.sessionId})`))
    .limit(limit);
}
