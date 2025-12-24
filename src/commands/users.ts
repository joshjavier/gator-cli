import { setUser } from "src/config";

export function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const username = args[0];
  setUser(username);
  console.log(`You have logged in as ${username}.`);
}
