import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { analyticsEvents } from "@/lib/db/schema";
import { getRequestIp } from "@/lib/ipHash";
import { lookupGeo, type GeoResult } from "@/lib/geo";

const GEO_COOKIE = "visitor_geo";

const eventSchema = z.object({
  type: z.enum(["click", "scroll", "dwell"]),
  page: z.string().max(256),
  section: z.string().max(128).optional(),
  elementId: z.string().max(128).optional(),
  x: z.number().optional(),
  y: z.number().optional(),
  scrollDepth: z.number().min(0).max(1).optional(),
});

const bodySchema = z.object({
  sessionId: z.string().min(1).max(64),
  events: z.array(eventSchema).min(1).max(50),
});

export async function POST(request: NextRequest) {
  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return new NextResponse(null, { status: 204 });
  }
  const { sessionId, events } = parsed.data;

  const store = await cookies();
  let geo: GeoResult = {};
  const cached = store.get(GEO_COOKIE)?.value;
  if (cached) {
    try {
      geo = JSON.parse(cached);
    } catch {
      geo = {};
    }
  } else {
    geo = await lookupGeo(getRequestIp(request));
    store.set(GEO_COOKIE, JSON.stringify(geo), {
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      path: "/",
    });
  }

  await db.insert(analyticsEvents).values(
    events.map((event) => ({
      sessionId,
      eventType: event.type,
      page: event.page,
      section: event.section ?? null,
      elementId: event.elementId ?? null,
      x: event.x ?? null,
      y: event.y ?? null,
      scrollDepth: event.scrollDepth ?? null,
      country: geo.country ?? null,
      city: geo.city ?? null,
    })),
  );

  return new NextResponse(null, { status: 204 });
}
