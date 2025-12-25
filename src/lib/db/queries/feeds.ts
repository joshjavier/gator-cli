import { eq, sql } from "drizzle-orm";
import { feeds, users } from "../schema";
import { db } from "..";

export async function createFeed(name: string, url: string, user_id: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, user_id })
    .returning();
  return result;
}

export async function getFeeds() {
  const results = await db
    .select({
      name: feeds.name,
      url: feeds.url,
      user: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.user_id, users.id));
  return results;
}
