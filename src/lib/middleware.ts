import type { CommandHandler, UserCommandHandler } from "src/commands/commands";
import { getUser } from "./db/queries/users";
import { readConfig } from "src/config";
import { styleText } from "node:util";

export function middlewareLoggedIn(
  handler: UserCommandHandler,
): CommandHandler {
  return async function (cmdName: string, ...args: string[]) {
    const { currentUserName } = readConfig();
    const user = await getUser(currentUserName);
    if (!user) {
      throw new Error(
        styleText(
          "yellow",
          `User ${styleText("bold", currentUserName)} not found.`,
        ),
      );
    }
    await handler(cmdName, user, ...args);
  };
}
