import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const postgres_url = process.env.POSTGRES_DB;

if (!postgres_url) {
  throw new Error("POSTGRES_DB environment variable is not defined");
}

export default defineConfig({
  schema: "src/schema.ts",
  out: "drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: postgres_url,
  },
});
