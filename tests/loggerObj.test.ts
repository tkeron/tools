import { describe, it, expect, spyOn, beforeEach, afterEach } from "bun:test";
import { logger } from "../src/loggerObj.js";
import type { Logger } from "../src/loggerObj.js";

describe("Logger interface", () => {
  it("should have all required methods", () => {
    expect(logger).toHaveProperty("log");
    expect(logger).toHaveProperty("error");
    expect(logger).toHaveProperty("warn");
    expect(logger).toHaveProperty("info");
    expect(typeof logger.log).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.info).toBe("function");
  });
});

describe("logger.log", () => {
  let logSpy: any;

  beforeEach(() => {
    logSpy = spyOn(console, "log");
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should call console.log with single string", () => {
    logger.log("test message");
    expect(logSpy).toHaveBeenCalledWith("test message");
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with multiple arguments", () => {
    logger.log("test", "multiple", "args");
    expect(logSpy).toHaveBeenCalledWith("test", "multiple", "args");
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with number", () => {
    logger.log(42);
    expect(logSpy).toHaveBeenCalledWith(42);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with object", () => {
    const obj = { key: "value" };
    logger.log(obj);
    expect(logSpy).toHaveBeenCalledWith(obj);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with array", () => {
    const arr = [1, 2, 3];
    logger.log(arr);
    expect(logSpy).toHaveBeenCalledWith(arr);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with null", () => {
    logger.log(null);
    expect(logSpy).toHaveBeenCalledWith(null);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with undefined", () => {
    logger.log(undefined);
    expect(logSpy).toHaveBeenCalledWith(undefined);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with boolean", () => {
    logger.log(true);
    expect(logSpy).toHaveBeenCalledWith(true);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with mixed types", () => {
    logger.log("string", 42, { key: "value" }, [1, 2], null, undefined, true);
    expect(logSpy).toHaveBeenCalledWith(
      "string",
      42,
      { key: "value" },
      [1, 2],
      null,
      undefined,
      true,
    );
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with no arguments", () => {
    logger.log();
    expect(logSpy).toHaveBeenCalledWith();
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log multiple times independently", () => {
    logger.log("first");
    logger.log("second");
    logger.log("third");
    expect(logSpy).toHaveBeenCalledTimes(3);
  });

  it("should call console.log with empty string", () => {
    logger.log("");
    expect(logSpy).toHaveBeenCalledWith("");
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with zero", () => {
    logger.log(0);
    expect(logSpy).toHaveBeenCalledWith(0);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with negative number", () => {
    logger.log(-42);
    expect(logSpy).toHaveBeenCalledWith(-42);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with NaN", () => {
    logger.log(NaN);
    expect(logSpy).toHaveBeenCalledWith(NaN);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log with Infinity", () => {
    logger.log(Infinity);
    expect(logSpy).toHaveBeenCalledWith(Infinity);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});

describe("logger.error", () => {
  let errorSpy: any;

  beforeEach(() => {
    errorSpy = spyOn(console, "error");
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("should call console.error with single string", () => {
    logger.error("error message");
    expect(errorSpy).toHaveBeenCalledWith("error message");
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.error with multiple arguments", () => {
    logger.error("error", "multiple", "args");
    expect(errorSpy).toHaveBeenCalledWith("error", "multiple", "args");
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.error with Error object", () => {
    const error = new Error("test error");
    logger.error(error);
    expect(errorSpy).toHaveBeenCalledWith(error);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.error with null", () => {
    logger.error(null);
    expect(errorSpy).toHaveBeenCalledWith(null);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.error with undefined", () => {
    logger.error(undefined);
    expect(errorSpy).toHaveBeenCalledWith(undefined);
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.error with no arguments", () => {
    logger.error();
    expect(errorSpy).toHaveBeenCalledWith();
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});

describe("logger.warn", () => {
  let warnSpy: any;

  beforeEach(() => {
    warnSpy = spyOn(console, "warn");
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("should call console.warn with single string", () => {
    logger.warn("warning message");
    expect(warnSpy).toHaveBeenCalledWith("warning message");
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.warn with multiple arguments", () => {
    logger.warn("warn", "multiple", "args");
    expect(warnSpy).toHaveBeenCalledWith("warn", "multiple", "args");
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.warn with null", () => {
    logger.warn(null);
    expect(warnSpy).toHaveBeenCalledWith(null);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.warn with undefined", () => {
    logger.warn(undefined);
    expect(warnSpy).toHaveBeenCalledWith(undefined);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.warn with no arguments", () => {
    logger.warn();
    expect(warnSpy).toHaveBeenCalledWith();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
});

describe("logger.info", () => {
  let infoSpy: any;

  beforeEach(() => {
    infoSpy = spyOn(console, "info");
  });

  afterEach(() => {
    infoSpy.mockRestore();
  });

  it("should call console.info with single string", () => {
    logger.info("info message");
    expect(infoSpy).toHaveBeenCalledWith("info message");
    expect(infoSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.info with multiple arguments", () => {
    logger.info("info", "multiple", "args");
    expect(infoSpy).toHaveBeenCalledWith("info", "multiple", "args");
    expect(infoSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.info with null", () => {
    logger.info(null);
    expect(infoSpy).toHaveBeenCalledWith(null);
    expect(infoSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.info with undefined", () => {
    logger.info(undefined);
    expect(infoSpy).toHaveBeenCalledWith(undefined);
    expect(infoSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.info with no arguments", () => {
    logger.info();
    expect(infoSpy).toHaveBeenCalledWith();
    expect(infoSpy).toHaveBeenCalledTimes(1);
  });
});

describe("Logger type compatibility", () => {
  it("should be compatible with Logger interface", () => {
    const testLogger: Logger = logger;
    expect(testLogger).toBeDefined();
  });

  it("should allow custom Logger implementation", () => {
    const customLogger: Logger = {
      log: () => {},
      error: () => {},
      warn: () => {},
      info: () => {},
    };
    expect(customLogger).toBeDefined();
  });
});
