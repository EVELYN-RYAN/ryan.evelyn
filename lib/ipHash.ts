import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";

function secret() {
  const value = process.env.IP_HASH_SECRET;
  if (!value) throw new Error("IP_HASH_SECRET is not set");
  return value;
}

export function hashIp(ip: string) {
  return createHmac("sha256", secret()).update(ip).digest("hex");
}

export function getRequestIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function getRequestIpHash(request: NextRequest) {
  return hashIp(getRequestIp(request));
}
