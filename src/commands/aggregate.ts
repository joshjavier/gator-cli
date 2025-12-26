import { styleText } from "node:util";
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import type { Feed } from "src/lib/db/schema";
import { fetchFeed } from "src/lib/rss";
import { parseDuration } from "src/lib/utils";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }
  const durationStr = args[0];
  const timeBetweenRequests = parseDuration(durationStr);

  console.log(`Collecting feeds every ${durationStr}...`);

  scrapeFeeds().catch(handleError);

  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}

export async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    console.log(styleText("yellow", "No feeds to fetch."));
    return;
  }
  console.log(styleText("green", "\nFound a feed to fetch!"));
  scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
  await markFeedFetched(feed.id);
  const feedData = await fetchFeed(feed.url);
  console.log(
    styleText(
      "blue",
      `Feed ${feedData.channel.title} collected, ${feedData.channel.item.length} items found`,
    ),
  );
}

function handleError(err: unknown) {
  if (err instanceof Error) {
    console.log("Error scraping feeds:", err.message);
    process.exit(1);
  }
  throw err;
}
