import process from "node:process";
import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";
import { handlerLogin } from "./commands/users";

function main() {
  try {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);

    const [, , cmdName, ...args] = process.argv;

    if (!cmdName) {
      console.log("usage: cli <command> [args...]");
      process.exit(1);
    }

    runCommand(registry, cmdName, ...args);
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
