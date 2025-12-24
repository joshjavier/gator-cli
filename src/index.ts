import process from "node:process";
import { readConfig, setUser } from "./config";

type CommandHandler = (cmdName: string, ...args: string[]) => void;
type CommandsRegistry = Record<string, CommandHandler>;

function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length === 0) {
    throw new Error("username is required");
  }
  const username = args[0];
  setUser(username);
  console.log(`You have logged in as ${username}.`);
}

function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  try {
    registry[cmdName](cmdName, ...args);
  } catch (err) {
    if (err instanceof Error) {
      console.log("CLI error:", err.message);
      process.exit(1);
    }
    throw err;
  }
}

function main() {
  try {
    const registry: CommandsRegistry = {};
    registerCommand(registry, "login", handlerLogin);

    const [, , cmdName, ...args] = process.argv;

    if (!cmdName) {
      console.log("CLI error: not enough arguments were provided.");
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
