import { readConfig, setUser } from "./config";

function main() {
  try {
    setUser("Josh");
    const config = readConfig();
    console.log(config);
  } catch (err) {
    if (err instanceof Error) {
      // case: no config file
      if (err.message.includes("no such file or directory")) {
        console.log("~/.gatorconfig.json not found.");
        return;
      }

      // case: missing fields in config file
      if (err.message.includes("missing fields")) {
        console.log("Config error:", err.message);
        return;
      }
    }

    throw err;
  }
}

main();
