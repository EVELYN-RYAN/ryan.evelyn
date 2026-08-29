import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";
import { getRequestIpHash } from "@/lib/ipHash";
import { checkRateLimit } from "@/lib/rateLimit";

const bodySchema = z.object({
  email: z.email().max(320),
  message: z.string().min(5).max(2000),
  projectId: z.string().max(128).optional(),
  company: z.string().optional(), // honeypot
});

export async function POST(request: NextRequest) {
  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const { email, message, projectId, company } = parsed.data;

  if (company) {
    // Honeypot tripped — pretend success without writing anything.
    return NextResponse.json({ ok: true });
  }

  const ipHash = getRequestIpHash(request);
  const { allowed } = await checkRateLimit({
    bucket: "feedback",
    key: ipHash,
    limit: 5,
    windowMs: 60 * 60_000,
  });
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  await db.insert(feedback).values({
    email,
    message,
    projectId: projectId ?? null,
    ipHash,
  });

  return NextResponse.json({ ok: true });
}
