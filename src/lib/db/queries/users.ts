import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name }).returning();
  return result;
}

export async function getUser(name: string) {
  const [result] = await db.select().from(users).where(eq(users.name, name));
  if (!result) {
    throw new Error(
      `User ${name} doesn't exist. Create a user with the 'register' command!`,
    );
  }
  return result;
}

export async function getUsers() {
  const result = await db
    .select({ id: users.id, name: users.name })
    .from(users);
  return result;
}

export async function deleteAllUsers() {
  await db.delete(users);
}
