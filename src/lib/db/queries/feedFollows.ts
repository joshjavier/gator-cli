import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";

export async function createFeedFollow(feedId: string, userId: string) {
  const [newFeedFollow] = await db
    .insert(feedFollows)
    .values({ feedId, userId })
    .returning();
  const [feedFollow] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feed: feeds.name,
      user: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
    .innerJoin(users, eq(users.id, feedFollows.userId))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return feedFollow;
}

export async function getFeedFollowsForUser(userId: string) {
  const feedFollowsForUser = await db
    .select({ feed: feeds.name, url: feeds.url })
    .from(feedFollows)
    .innerJoin(feeds, eq(feeds.id, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId));

  return feedFollowsForUser;
}

export async function deleteFeedFollow(feedUrl: string, userId: string) {
  const [feed] = await db
    .select({ id: feeds.id, name: feeds.name })
    .from(feeds)
    .where(eq(feeds.url, feedUrl));

  if (!feed) {
    throw new Error("Feed not found");
  }

  await db
    .delete(feedFollows)
    .where(
      and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feed.id)),
    );

  return feed;
}
