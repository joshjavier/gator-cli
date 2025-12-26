import { styleText } from "node:util";
import { PostgresError } from "postgres";
import { createFeedFollow } from "src/lib/db/queries/feedFollows";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import type { Feed, User } from "src/lib/db/schema";

export async function handlerFeeds(cmdName: string) {
  const feeds = await getFeeds();
  console.table(feeds);
}

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length < 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }
  const [name, url] = args;

  try {
    const feed = await createFeed(name, url, user.id);
    printFeed(feed, user);

    // Automaticaly follow the newly created feed
    const feedFollow = await createFeedFollow(feed.id, user.id);
    console.log(`User ${user.name} is also following ${feed.name}.`);
  } catch (err) {
    if (err instanceof Error) {
      if ((err.cause as PostgresError).code === "23505") {
        throw new Error("Feed with same URL already exists!");
      }
    }
    throw err;
  }
}

function printFeed(feed: Feed, user: User) {
  console.log(styleText("green", `Feed ${feed.name} has been created.`));
  console.log(` - URL: ${feed.url}`);
  console.log(` - Created at: ${feed.createdAt.toDateString()}`);
  console.log(` - Added by: ${user.name}`);
}
