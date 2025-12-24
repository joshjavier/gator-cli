import { XMLParser } from "fast-xml-parser";

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
