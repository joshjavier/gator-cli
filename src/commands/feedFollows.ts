import { PostgresError } from "postgres";
import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feedFollows";
import { getFeed } from "src/lib/db/queries/feeds";
import type { User } from "src/lib/db/schema";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];

  try {
    const feed = await getFeed(url);
    const feedFollow = await createFeedFollow(feed.id, user.id);
    console.log(`User ${user.name} is now following ${feed.name}.`);
  } catch (err) {
    if (err instanceof Error) {
      if ((err.cause as PostgresError).code === "23505") {
        throw new Error("You're already following this feed!");
      }
    }
    throw err;
  }
}

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const feedUrl = args[0];

  const unfollowedFeed = await deleteFeedFollow(feedUrl, user.id);
  console.log(`You have unfollowed ${unfollowedFeed.name}.`);
}

export async function handlerFollowing(cmdName: string, user: User) {
  const following = await getFeedFollowsForUser(user.id);

  if (following.length === 0) {
    console.log(`User ${user.name} is not following any feeds.`);
    return;
  }

  console.log(`Feeds followed by ${user.name}:`);
  console.table(following);
}
