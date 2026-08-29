import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

function createDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return drizzle(neon(url), { schema });
}

let instance: Db | undefined;

// Lazily connects on first real query, rather than at module import time —
// this file is imported during `next build`'s page-data collection pass,
// which happens before real env vars/DB are necessarily available.
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    if (!instance) instance = createDb();
    return Reflect.get(instance, prop, receiver);
  },
});
