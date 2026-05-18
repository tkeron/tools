import { describe, it, expect, afterEach } from "bun:test";
import { setupSigintHandler } from "../src/setupSigintHandler.js";

describe("setupSigintHandler", () => {
  const originalListeners = process.listeners("SIGINT").slice();

  afterEach(() => {
    process.removeAllListeners("SIGINT");
    originalListeners.forEach((l) => process.on("SIGINT", l));
  });

  it("registers a SIGINT listener", () => {
    const initial = process.listenerCount("SIGINT");
    setupSigintHandler(async () => {});
    expect(process.listenerCount("SIGINT")).toBe(initial + 1);
  });

  it("invokes the callback when SIGINT listener is triggered", async () => {
    let called = false;
    const exitSpy = (process as any).exit;
    let exitCode: number | undefined;
    (process as any).exit = (code?: number) => {
      exitCode = code;
    };
    try {
      setupSigintHandler(async () => {
        called = true;
      });
      const listeners = process.listeners("SIGINT");
      const added = listeners[listeners.length - 1] as () => Promise<void>;
      await added();
      expect(called).toBe(true);
      expect(exitCode).toBe(0);
    } finally {
      (process as any).exit = exitSpy;
    }
  });

  it("awaits the async callback before exiting", async () => {
    const order: string[] = [];
    const exitSpy = (process as any).exit;
    (process as any).exit = () => {
      order.push("exit");
    };
    try {
      setupSigintHandler(async () => {
        await new Promise((r) => setTimeout(r, 10));
        order.push("callback");
      });
      const listeners = process.listeners("SIGINT");
      const added = listeners[listeners.length - 1] as () => Promise<void>;
      await added();
      expect(order).toEqual(["callback", "exit"]);
    } finally {
      (process as any).exit = exitSpy;
    }
  });
});
