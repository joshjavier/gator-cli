import type { User } from "src/lib/db/schema";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler,
) {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  try {
    const handler = registry[cmdName];

    if (!handler) {
      throw new Error(`unknown command: ${cmdName}`);
    }

    await handler(cmdName, ...args);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      process.exit(1);
    }
    throw err;
  }
}
