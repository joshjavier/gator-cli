import { styleText } from "node:util";
import { getPostsForUser } from "src/lib/db/queries/posts";
import type { User } from "src/lib/db/schema";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  const limit = args[0] ? Number(args[0]) : 2;
  const posts = await getPostsForUser(user.id, limit);

  console.log(
    styleText(
      "blue",
      `${limit} Latest Posts for ${styleText("bold", user.name)}:`,
    ),
  );

  for (const post of posts) {
    console.log(styleText(["bold", "underline"], `\n${post.title}`));
    console.log(` - Published on: ${post.pubDate.toDateString()}`);
    console.log(` - URL: ${post.link}`);
    console.log(` - Feed: ${post.feed}`);
  }
}
