import { eq, sql } from "drizzle-orm";
import { feeds, users } from "../schema";
import { db } from "..";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
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
    .innerJoin(users, eq(feeds.userId, users.id));
  return results;
}

export async function getFeed(url: string) {
  const [feed] = await db.select().from(feeds).where(eq(feeds.url, url));
  if (!feed) {
    throw new Error(
      "Feed not found. You can add a feed with the `addfeed` command.",
    );
  }
  return feed;
}
