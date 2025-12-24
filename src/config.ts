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
  const data = fs.readFileSync(path, { encoding: "utf-8" });
  const rawConfig = JSON.parse(data);
  return validateConfig(rawConfig);
}

// Helper functions

function getConfigFilePath(): string {
  return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg: Config): void {
  const file = getConfigFilePath();
  const rawConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };
  const data = JSON.stringify(rawConfig, null, 2);
  fs.writeFileSync(file, data);
}

function validateConfig(rawConfig: any): Config {
  const fields = Object.keys(rawConfig);
  const missing: string[] = [];
  if (!fields.includes("db_url")) {
    missing.push("db_url");
  }
  if (!fields.includes("current_user_name")) {
    missing.push("current_user_name");
  }
  if (missing.length > 0) {
    throw new Error(`missing field(s): ${missing.join(", ")}`);
  }
  return {
    dbUrl: rawConfig.db_url,
    currentUserName: rawConfig.current_user_name,
  };
}
