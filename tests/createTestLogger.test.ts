import { describe, it, expect, spyOn, beforeEach, afterEach } from "bun:test";
import { createTestLogger } from "../src/createTestLogger.js";
import type { Logger } from "../src/loggerObj.js";

describe("createTestLogger", () => {
  it("should return an object with logger and arrays", () => {
    const result = createTestLogger();
    expect(result).toHaveProperty("logger");
    expect(result).toHaveProperty("logs");
    expect(result).toHaveProperty("errors");
    expect(result).toHaveProperty("warns");
    expect(result).toHaveProperty("infos");
    expect(Array.isArray(result.logs)).toBe(true);
    expect(Array.isArray(result.errors)).toBe(true);
    expect(Array.isArray(result.warns)).toBe(true);
    expect(Array.isArray(result.infos)).toBe(true);
  });

  it("should return empty arrays initially", () => {
    const { logs, errors, warns, infos } = createTestLogger();
    expect(logs).toEqual([]);
    expect(errors).toEqual([]);
    expect(warns).toEqual([]);
    expect(infos).toEqual([]);
  });

  it("should return a logger compatible with Logger interface", () => {
    const { logger } = createTestLogger();
    const testLogger: Logger = logger;
    expect(testLogger).toBeDefined();
  });

  it("should have all required methods", () => {
    const { logger } = createTestLogger();
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

describe("createTestLogger.logger.log", () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = spyOn(console, "log");
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should not call console.log", () => {
    const { logger } = createTestLogger();
    logger.log("test");
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should capture single string", () => {
    const { logger, logs } = createTestLogger();
    logger.log("test message");
    expect(logs).toEqual(["test message"]);
  });

  it("should capture multiple strings", () => {
    const { logger, logs } = createTestLogger();
    logger.log("test", "multiple", "args");
    expect(logs).toEqual(["test multiple args"]);
  });

  it("should capture number", () => {
    const { logger, logs } = createTestLogger();
    logger.log(42);
    expect(logs).toEqual(["42"]);
  });

  it("should capture object as JSON", () => {
    const { logger, logs } = createTestLogger();
    logger.log({ key: "value" });
    expect(logs).toEqual(['{"key":"value"}']);
  });

  it("should capture array as JSON", () => {
    const { logger, logs } = createTestLogger();
    logger.log([1, 2, 3]);
    expect(logs).toEqual(["[1,2,3]"]);
  });

  it("should capture null", () => {
    const { logger, logs } = createTestLogger();
    logger.log(null);
    expect(logs).toEqual(["null"]);
  });

  it("should capture undefined", () => {
    const { logger, logs } = createTestLogger();
    logger.log(undefined);
    expect(logs).toEqual(["undefined"]);
  });

  it("should capture boolean", () => {
    const { logger, logs } = createTestLogger();
    logger.log(true);
    expect(logs).toEqual(["true"]);
  });

  it("should capture multiple calls", () => {
    const { logger, logs } = createTestLogger();
    logger.log("first");
    logger.log("second");
    logger.log("third");
    expect(logs).toEqual(["first", "second", "third"]);
  });

  it("should capture mixed types", () => {
    const { logger, logs } = createTestLogger();
    logger.log("string", 42, { key: "val" });
    expect(logs).toEqual(['string 42 {"key":"val"}']);
  });

  it("should capture empty string", () => {
    const { logger, logs } = createTestLogger();
    logger.log("");
    expect(logs).toEqual([""]);
  });

  it("should capture zero", () => {
    const { logger, logs } = createTestLogger();
    logger.log(0);
    expect(logs).toEqual(["0"]);
  });

  it("should capture negative number", () => {
    const { logger, logs } = createTestLogger();
    logger.log(-42);
    expect(logs).toEqual(["-42"]);
  });

  it("should capture NaN", () => {
    const { logger, logs } = createTestLogger();
    logger.log(NaN);
    expect(logs).toEqual(["null"]);
  });

  it("should capture Infinity", () => {
    const { logger, logs } = createTestLogger();
    logger.log(Infinity);
    expect(logs).toEqual(["null"]);
  });

  it("should not mutate logs array reference", () => {
    const testLogger = createTestLogger();
    const originalLogsRef = testLogger.logs;
    testLogger.logger.log("test");
    expect(testLogger.logs).toBe(originalLogsRef);
  });
});

describe("createTestLogger.logger.error", () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = spyOn(console, "error");
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should not call console.error", () => {
    const { logger } = createTestLogger();
    logger.error("test");
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should capture single string", () => {
    const { logger, errors } = createTestLogger();
    logger.error("error message");
    expect(errors).toEqual(["error message"]);
  });

  it("should capture multiple strings", () => {
    const { logger, errors } = createTestLogger();
    logger.error("error", "multiple", "args");
    expect(errors).toEqual(["error multiple args"]);
  });

  it("should capture Error object", () => {
    const { logger, errors } = createTestLogger();
    const error = new Error("test error");
    logger.error(error);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain("test error");
  });

  it("should capture null", () => {
    const { logger, errors } = createTestLogger();
    logger.error(null);
    expect(errors).toEqual(["null"]);
  });

  it("should capture undefined", () => {
    const { logger, errors } = createTestLogger();
    logger.error(undefined);
    expect(errors).toEqual(["undefined"]);
  });

  it("should capture multiple calls", () => {
    const { logger, errors } = createTestLogger();
    logger.error("first");
    logger.error("second");
    logger.error("third");
    expect(errors).toEqual(["first", "second", "third"]);
  });
});

describe("createTestLogger.logger.warn", () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = spyOn(console, "warn");
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should not call console.warn", () => {
    const { logger } = createTestLogger();
    logger.warn("test");
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should capture single string", () => {
    const { logger, warns } = createTestLogger();
    logger.warn("warning message");
    expect(warns).toEqual(["warning message"]);
  });

  it("should capture multiple strings", () => {
    const { logger, warns } = createTestLogger();
    logger.warn("warn", "multiple", "args");
    expect(warns).toEqual(["warn multiple args"]);
  });

  it("should capture null", () => {
    const { logger, warns } = createTestLogger();
    logger.warn(null);
    expect(warns).toEqual(["null"]);
  });

  it("should capture undefined", () => {
    const { logger, warns } = createTestLogger();
    logger.warn(undefined);
    expect(warns).toEqual(["undefined"]);
  });

  it("should capture multiple calls", () => {
    const { logger, warns } = createTestLogger();
    logger.warn("first");
    logger.warn("second");
    logger.warn("third");
    expect(warns).toEqual(["first", "second", "third"]);
  });
});

describe("createTestLogger.logger.info", () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = spyOn(console, "info");
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should not call console.info", () => {
    const { logger } = createTestLogger();
    logger.info("test");
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it("should capture single string", () => {
    const { logger, infos } = createTestLogger();
    logger.info("info message");
    expect(infos).toEqual(["info message"]);
  });

  it("should capture multiple strings", () => {
    const { logger, infos } = createTestLogger();
    logger.info("info", "multiple", "args");
    expect(infos).toEqual(["info multiple args"]);
  });

  it("should capture null", () => {
    const { logger, infos } = createTestLogger();
    logger.info(null);
    expect(infos).toEqual(["null"]);
  });

  it("should capture undefined", () => {
    const { logger, infos } = createTestLogger();
    logger.info(undefined);
    expect(infos).toEqual(["undefined"]);
  });

  it("should capture multiple calls", () => {
    const { logger, infos } = createTestLogger();
    logger.info("first");
    logger.info("second");
    logger.info("third");
    expect(infos).toEqual(["first", "second", "third"]);
  });
});

describe("createTestLogger isolation", () => {
  it("should create independent loggers", () => {
    const logger1 = createTestLogger();
    const logger2 = createTestLogger();

    logger1.logger.log("logger1");
    logger2.logger.log("logger2");

    expect(logger1.logs).toEqual(["logger1"]);
    expect(logger2.logs).toEqual(["logger2"]);
  });

  it("should not share state between instances", () => {
    const logger1 = createTestLogger();
    const logger2 = createTestLogger();

    logger1.logger.log("test1");
    logger1.logger.error("error1");

    expect(logger2.logs).toEqual([]);
    expect(logger2.errors).toEqual([]);
  });

  it("should allow manual array manipulation", () => {
    const testLogger = createTestLogger();
    testLogger.logger.log("test");
    expect(testLogger.logs).toEqual(["test"]);

    testLogger.logs.length = 0;
    expect(testLogger.logs).toEqual([]);
  });
});

describe("createTestLogger all methods", () => {
  it("should capture to correct arrays", () => {
    const { logger, logs, errors, warns, infos } = createTestLogger();

    logger.log("log message");
    logger.error("error message");
    logger.warn("warn message");
    logger.info("info message");

    expect(logs).toEqual(["log message"]);
    expect(errors).toEqual(["error message"]);
    expect(warns).toEqual(["warn message"]);
    expect(infos).toEqual(["info message"]);
  });

  it("should not cross-contaminate arrays", () => {
    const { logger, logs, errors, warns, infos } = createTestLogger();

    logger.log("log");
    expect(errors).toEqual([]);
    expect(warns).toEqual([]);
    expect(infos).toEqual([]);

    logger.error("error");
    expect(logs).toEqual(["log"]);
    expect(warns).toEqual([]);
    expect(infos).toEqual([]);

    logger.warn("warn");
    expect(logs).toEqual(["log"]);
    expect(errors).toEqual(["error"]);
    expect(infos).toEqual([]);

    logger.info("info");
    expect(logs).toEqual(["log"]);
    expect(errors).toEqual(["error"]);
    expect(warns).toEqual(["warn"]);
  });
});
