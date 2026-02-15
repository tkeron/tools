import { describe, it, expect, spyOn, beforeEach, afterEach } from "bun:test";
import { silentLogger } from "../src/silentLogger.js";
import type { Logger } from "../src/loggerObj.js";

describe("silentLogger interface", () => {
  it("should have all required Logger methods", () => {
    expect(silentLogger).toHaveProperty("log");
    expect(silentLogger).toHaveProperty("error");
    expect(silentLogger).toHaveProperty("warn");
    expect(silentLogger).toHaveProperty("info");
    expect(typeof silentLogger.log).toBe("function");
    expect(typeof silentLogger.error).toBe("function");
    expect(typeof silentLogger.warn).toBe("function");
    expect(typeof silentLogger.info).toBe("function");
  });

  it("should be compatible with Logger type", () => {
    const testLogger: Logger = silentLogger;
    expect(testLogger).toBeDefined();
  });
});

describe("silentLogger.log", () => {
  let logSpy: any;

  beforeEach(() => {
    logSpy = spyOn(console, "log");
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("should not call console.log with single string", () => {
    silentLogger.log("test message");
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("should not call console.log with multiple arguments", () => {
    silentLogger.log("test", "multiple", "args");
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("should not call console.log with object", () => {
    silentLogger.log({ key: "value" });
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("should not call console.log with null", () => {
    silentLogger.log(null);
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("should not call console.log with undefined", () => {
    silentLogger.log(undefined);
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("should not call console.log with no arguments", () => {
    silentLogger.log();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("should not call console.log when called multiple times", () => {
    silentLogger.log("first");
    silentLogger.log("second");
    silentLogger.log("third");
    expect(logSpy).not.toHaveBeenCalled();
  });

  it("should not throw when called", () => {
    expect(() => silentLogger.log("test")).not.toThrow();
  });

  it("should return undefined", () => {
    const result = silentLogger.log("test");
    expect(result).toBeUndefined();
  });
});

describe("silentLogger.error", () => {
  let errorSpy: any;

  beforeEach(() => {
    errorSpy = spyOn(console, "error");
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it("should not call console.error with single string", () => {
    silentLogger.error("error message");
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should not call console.error with multiple arguments", () => {
    silentLogger.error("error", "multiple", "args");
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should not call console.error with Error object", () => {
    silentLogger.error(new Error("test error"));
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should not call console.error with null", () => {
    silentLogger.error(null);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should not call console.error with undefined", () => {
    silentLogger.error(undefined);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should not call console.error with no arguments", () => {
    silentLogger.error();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should not throw when called", () => {
    expect(() => silentLogger.error("test")).not.toThrow();
  });

  it("should return undefined", () => {
    const result = silentLogger.error("test");
    expect(result).toBeUndefined();
  });
});

describe("silentLogger.warn", () => {
  let warnSpy: any;

  beforeEach(() => {
    warnSpy = spyOn(console, "warn");
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("should not call console.warn with single string", () => {
    silentLogger.warn("warning message");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should not call console.warn with multiple arguments", () => {
    silentLogger.warn("warn", "multiple", "args");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should not call console.warn with null", () => {
    silentLogger.warn(null);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should not call console.warn with undefined", () => {
    silentLogger.warn(undefined);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should not call console.warn with no arguments", () => {
    silentLogger.warn();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("should not throw when called", () => {
    expect(() => silentLogger.warn("test")).not.toThrow();
  });

  it("should return undefined", () => {
    const result = silentLogger.warn("test");
    expect(result).toBeUndefined();
  });
});

describe("silentLogger.info", () => {
  let infoSpy: any;

  beforeEach(() => {
    infoSpy = spyOn(console, "info");
  });

  afterEach(() => {
    infoSpy.mockRestore();
  });

  it("should not call console.info with single string", () => {
    silentLogger.info("info message");
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it("should not call console.info with multiple arguments", () => {
    silentLogger.info("info", "multiple", "args");
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it("should not call console.info with null", () => {
    silentLogger.info(null);
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it("should not call console.info with undefined", () => {
    silentLogger.info(undefined);
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it("should not call console.info with no arguments", () => {
    silentLogger.info();
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it("should not throw when called", () => {
    expect(() => silentLogger.info("test")).not.toThrow();
  });

  it("should return undefined", () => {
    const result = silentLogger.info("test");
    expect(result).toBeUndefined();
  });
});

describe("silentLogger behavior", () => {
  it("should not produce any console output when all methods are called", () => {
    const logSpy = spyOn(console, "log");
    const errorSpy = spyOn(console, "error");
    const warnSpy = spyOn(console, "warn");
    const infoSpy = spyOn(console, "info");

    silentLogger.log("test");
    silentLogger.error("test");
    silentLogger.warn("test");
    silentLogger.info("test");

    expect(logSpy).not.toHaveBeenCalled();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    infoSpy.mockRestore();
  });
});
