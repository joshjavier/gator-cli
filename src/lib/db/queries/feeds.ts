import { sql } from "drizzle-orm";
import { feeds } from "../schema";
import { db } from "..";

export async function createFeed(name: string, url: string, user_id: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, user_id })
    .returning();
  return result;
}
