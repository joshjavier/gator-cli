import { eq } from "drizzle-orm";
import { db } from "..";
import {
  feedFollows,
  feedFollows,
  feedFollows,
  feedFollows,
  feeds,
  users,
} from "../schema";

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
