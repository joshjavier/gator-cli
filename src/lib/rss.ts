import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });
  if (!response.ok) {
    throw new Error(
      `failed to fetch feed: ${response.status} ${response.statusText}`,
    );
  }

  const xmlData = await response.text();
  const parser = new XMLParser();
  const parsed = parser.parse(xmlData);

  const channel = parsed.rss?.channel;
  if (!channel) {
    throw new Error("failed to parse the RSS feed");
  }

  // Extract metadata
  if (!channel.title || !channel.link || !channel.description) {
    throw new Error("one or more metadata fields are missing");
  }
  const { title, link, description } = channel;

  // Extract feed items
  if (!channel.item) {
    throw new Error("feed items are missing");
  }
  const items: any[] = Array.isArray(channel.item)
    ? channel.item
    : [channel.item];
  const rssItems: RSSItem[] = [];

  for (const item of items) {
    if (!item.title || !item.link || !item.description || !item.pubDate) {
      continue;
    }

    rssItems.push({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: item.pubDate,
    });
  }

  // Assemble the result
  return {
    channel: {
      title,
      link,
      description,
      item: rssItems,
    },
  };
}
