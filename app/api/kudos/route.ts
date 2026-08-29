import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { kudos } from "@/lib/db/schema";
import { getOrCreateVisitorToken } from "@/lib/visitor";
import { getRequestIpHash } from "@/lib/ipHash";
import { checkRateLimit } from "@/lib/rateLimit";

const postSchema = z.object({
  itemId: z.string().min(1).max(128),
});

async function countFor(itemId: string) {
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(kudos)
    .where(eq(kudos.itemId, itemId));
  return Number(row?.count ?? 0);
}

export async function GET(request: NextRequest) {
  const itemId = request.nextUrl.searchParams.get("itemId");
  if (!itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  const visitorToken = await getOrCreateVisitorToken();
  const [existing] = await db
    .select({ id: kudos.id })
    .from(kudos)
    .where(and(eq(kudos.itemId, itemId), eq(kudos.visitorToken, visitorToken)))
    .limit(1);

  return NextResponse.json({ itemId, count: await countFor(itemId), given: Boolean(existing) });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const { itemId } = parsed.data;

  const ipHash = getRequestIpHash(request);
  const { allowed } = await checkRateLimit({
    bucket: "kudos",
    key: ipHash,
    limit: 30,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const visitorToken = await getOrCreateVisitorToken();

  const inserted = await db
    .insert(kudos)
    .values({ itemId, visitorToken, ipHash })
    .onConflictDoNothing({ target: [kudos.itemId, kudos.visitorToken] })
    .returning({ id: kudos.id });

  const count = await countFor(itemId);

  return NextResponse.json({ alreadyGiven: inserted.length === 0, count });
}
