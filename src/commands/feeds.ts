import { XMLParser } from "fast-xml-parser";
import { PostgresError } from "postgres";
import { readConfig } from "src/config";
import { createFeedFollow } from "src/lib/db/queries/feedFollows";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  // Fetch the feed data
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });
  const xmlData = await response.text();

  // Parse the XML
  const parser = new XMLParser();
  const parsed = parser.parse(xmlData);

  // Extract the channel field
  if (!parsed.rss?.channel) {
    throw new Error("can't parse the RSS feed");
  }
  const channel = parsed.rss.channel;

  // Extract metadata
  if (!channel.title || !channel.link || !channel.description) {
    throw new Error("one or more metadata fields are missing");
  }
  const { title, link, description } = channel;

  // Extract feed items
  if (!channel.item) {
    throw new Error("feed items are missing");
  }
  const items: RSSItem[] = [];
  if (Array.isArray(channel.item)) {
    for (let i = 0; i < channel.item.length; i++) {
      const item = channel.item[i];
      items[i] = {
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
      };
    }
  }

  // Assemble the result
  return {
    channel: {
      title,
      link,
      description,
      item: items,
    },
  };
}

export async function handlerAgg(cmdName: string) {
  // TODO: for now, fetch the feed below and console.log the entire object
  // https://www.wagslane.dev/index.xml
  const rssFeed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.dir(rssFeed, { depth: null, colors: true });
}

export async function handlerFeeds(cmdName: string) {
  const feeds = await getFeeds();
  console.table(feeds);
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  if (args.length < 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }
  const [name, url] = args;
  const { currentUserName } = readConfig();

  try {
    const user = await getUser(currentUserName);
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
  console.log(`Feed ${feed.name} has been created.`);
  console.log(` - URL: ${feed.url}`);
  console.log(` - Created at: ${feed.createdAt.toDateString()}`);
  console.log(` - Added by: ${user.name}`);
}
