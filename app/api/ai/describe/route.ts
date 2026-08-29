import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { callOpenRouter } from "@/lib/openrouter";
import { getRequestIpHash } from "@/lib/ipHash";
import { checkRateLimit } from "@/lib/rateLimit";
import { projects } from "@/lib/content/projects";

const bodySchema = z.object({
  itemId: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const meta = projects.find((p) => p.id === parsed.data.itemId);
  if (!meta) {
    return NextResponse.json({ error: "unknown_item" }, { status: 404 });
  }

  const ipHash = getRequestIpHash(request);
  const { allowed } = await checkRateLimit({
    bucket: "ai-describe",
    key: ipHash,
    limit: 5,
    windowMs: 60 * 60_000,
  });
  if (!allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const tagline = await callOpenRouter([
      {
        role: "system",
        content:
          "Respond with a single punchy one-sentence tagline for the project below. No preamble, no quotes.",
      },
      {
        role: "user",
        content: `Title: ${meta.title}\nDescription: ${meta.description}\nTags: ${meta.tags.join(", ")}`,
      },
    ]);
    return NextResponse.json({ tagline });
  } catch {
    return NextResponse.json({ error: "ai_unavailable" }, { status: 503 });
  }
}
