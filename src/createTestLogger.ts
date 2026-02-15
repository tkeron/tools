import type { Logger } from "./loggerObj.js";

export const createTestLogger = () => {
  const logs: string[] = [];
  const errors: string[] = [];
  const warns: string[] = [];
  const infos: string[] = [];

  const format = (args: unknown[]) =>
    args
      .map((a) => {
        if (typeof a === "string") return a;
        if (a === undefined) return "undefined";
        if (a instanceof Error) return a.stack || a.message || String(a);
        return JSON.stringify(a);
      })
      .join(" ");

  return {
    logger: {
      log: (...args: unknown[]) => logs.push(format(args)),
      error: (...args: unknown[]) => errors.push(format(args)),
      warn: (...args: unknown[]) => warns.push(format(args)),
      info: (...args: unknown[]) => infos.push(format(args)),
    } as Logger,
    logs,
    errors,
    warns,
    infos,
  };
};
