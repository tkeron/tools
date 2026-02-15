import type { Logger } from "./loggerObj.js";

export const silentLogger: Logger = {
  log: () => {},
  error: () => {},
  warn: () => {},
  info: () => {},
};
