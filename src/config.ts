import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export type Config = {
  dbUrl: string;
  currentUserName: string;
};

export function setUser(username: string): void {
  const config = readConfig();
  config.currentUserName = username;
  writeConfig(config);
}

export function readConfig(): Config {
  const path = getConfigFilePath();
  const rawConfig = fs.readFileSync(path, { encoding: "utf-8" });
  return validateConfig(rawConfig);
}

// Helper functions

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const file = getConfigFilePath();
  const data = JSON.stringify({
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  });
  fs.writeFileSync(file, data);
}

function validateConfig(rawConfig: any): Config {
  const parsed = JSON.parse(rawConfig);
  const fields = Object.keys(parsed);
  const missing: string[] = [];
  if (!fields.includes("db_url")) {
    missing.push("db_url");
  }
  // if (!fields.includes("current_user_name")) {
  //   missing.push("current_user_name");
  // }
  if (missing.length > 0) {
    throw new Error(`missing field(s): ${missing.join(", ")}`);
  }
  return {
    dbUrl: parsed.db_url,
    currentUserName: parsed.current_user_name,
  };
}
