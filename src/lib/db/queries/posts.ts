import type { RSSItem } from "src/lib/rss";
import { feeds, posts } from "../schema";
import { db } from "..";
import { desc, eq } from "drizzle-orm";

export async function createPost(item: RSSItem, feedId: string) {
  const [result] = await db
    .insert(posts)
    .values({
      title: item.title,
      url: item.link,
      description: item.description,
      publishedAt: new Date(item.pubDate),
      feedId,
    })
    .returning();
  return result;
}

export async function getPostsForUser(userId: string, limit: number = 2) {
  const result = await db
    .select({
      title: posts.title,
      pubDate: posts.publishedAt,
      link: posts.url,
      feed: feeds.name,
    })
    .from(posts)
    .innerJoin(feeds, eq(feeds.id, posts.feedId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result;
}
