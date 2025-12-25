import { PostgresError } from "postgres";
import { readConfig } from "src/config";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feedFollows";
import { getFeed } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const url = args[0];
  const { currentUserName } = readConfig();

  try {
    const feed = await getFeed(url);
    const user = await getUser(currentUserName);
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

export async function handlerFollowing(cmdName: string) {
  const { currentUserName } = readConfig();

  const user = await getUser(currentUserName);
  const following = await getFeedFollowsForUser(user.id);

  if (following.length === 0) {
    console.log(`User ${user.name} is not following any feeds.`);
    return;
  }

  console.log(`Feeds followed by ${user.name}:`);
  console.table(following);
}
