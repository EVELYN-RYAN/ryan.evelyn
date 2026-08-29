import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "./db";
import { rateLimitHits } from "./db/schema";

interface RateLimitOptions {
  bucket: string;
  key: string;
  limit: number;
  windowMs: number;
}

export async function checkRateLimit({ bucket, key, limit, windowMs }: RateLimitOptions) {
  const windowStart = new Date(Date.now() - windowMs);

  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(rateLimitHits)
    .where(
      and(eq(rateLimitHits.bucket, bucket), eq(rateLimitHits.key, key), gte(rateLimitHits.createdAt, windowStart)),
    );

  if (Number(row?.count ?? 0) >= limit) {
    return { allowed: false as const };
  }

  await db.insert(rateLimitHits).values({ bucket, key });

  // Opportunistic cleanup so the table doesn't grow unbounded.
  void db.delete(rateLimitHits).where(lt(rateLimitHits.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));

  return { allowed: true as const };
}
