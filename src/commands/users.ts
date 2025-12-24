import { PostgresError } from "postgres";
import { setUser } from "src/config";
import { createUser, deleteAllUsers, getUser } from "src/lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const name = args[0];
  const user = await getUser(name);
  if (!user) {
    throw new Error(
      `User ${name} doesn't exist. Create a user with the 'register' command!`,
    );
  }
  setUser(user.name);
  console.log(`You have logged in as ${name}.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }
  const name = args[0];
  try {
    const user = await createUser(name);
    setUser(user.name);
    console.log(`User ${user.name} has been created.`);
    console.log(` - ID: ${user.id}`);
    console.log(` - Name: ${user.name}`);
    console.log(` - Created at: ${user.createdAt.toDateString()}`);
  } catch (err) {
    if (err instanceof Error) {
      if ((err.cause as PostgresError).code === "23505") {
        throw new Error(
          "User already exists! Log in or register with a different name.",
        );
      }
    }
    throw err;
  }
}

export async function handlerReset(cmdName: string) {
  await deleteAllUsers();
  console.log("All users have been deleted from the database.");
}
