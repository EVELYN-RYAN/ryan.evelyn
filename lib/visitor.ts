import { cookies } from "next/headers";
import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "visitor_token";

function secret() {
  const value = process.env.VISITOR_TOKEN_SECRET;
  if (!value) throw new Error("VISITOR_TOKEN_SECRET is not set");
  return value;
}

function sign(uuid: string) {
  return createHmac("sha256", secret()).update(uuid).digest("hex");
}

function isValid(token: string) {
  const [uuid, signature] = token.split(".");
  if (!uuid || !signature) return false;

  const expected = sign(uuid);
  const actual = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (actual.length !== expectedBuf.length) return false;
  return timingSafeEqual(actual, expectedBuf);
}

export async function getOrCreateVisitorToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing && isValid(existing)) return existing;

  const uuid = randomUUID();
  const token = `${uuid}.${sign(uuid)}`;
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return token;
}
