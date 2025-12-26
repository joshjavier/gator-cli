import { styleText } from "node:util";

export function parseDuration(durationStr: string) {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(
      styleText("red", `Duration ${durationStr} cannot be parsed`),
    );
  }

  const factorMap: Record<string, number> = {
    ms: 1,
    s: 1_000,
    m: 60_000,
    h: 3.6e6,
  };
  const [, value, unit] = match;

  if (!(unit in factorMap)) {
    throw new Error(
      styleText(
        "red",
        `Invalid duration unit. Use ${styleText("underline", "ms")}, ${styleText("underline", "s")}, ${styleText("underline", "m")}, or ${styleText("underline", "h")}.`,
      ),
    );
  }

  return Number(value) * factorMap[unit];
}
