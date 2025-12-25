import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
} from "./commands/users";
import { handlerAddFeed, handlerAgg, handlerFeeds } from "./commands/feeds";
import { handlerFollow, handlerFollowing } from "./commands/feedFollows";
import { middlewareLoggedIn } from "./lib/middleware";

async function main() {
  try {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerReset);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(registry, "feeds", handlerFeeds);
    registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(
      registry,
      "following",
      middlewareLoggedIn(handlerFollowing),
    );

    const [, , cmdName, ...args] = process.argv;

    if (!cmdName) {
      console.log("usage: cli <command> [args...]");
      process.exit(1);
    }

    await runCommand(registry, cmdName, ...args);
    process.exit(0);
  } catch (err) {
    if (err instanceof Error) {
      // case: no config file
      if (err.message.includes("no such file or directory")) {
        console.log("Config error: ~/.gatorconfig.json not found.");
        process.exit(1);
      }

      // case: missing fields in config file
      if (err.message.includes("missing field(s)")) {
        console.log("Config error:", err.message);
        process.exit(1);
      }
    }

    throw err;
  }
}

main();
