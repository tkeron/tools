import { describe, it, expect } from "bun:test";
import { cleanupOrphanedTempDirs } from "../src/cleanupOrphanedTempDirs.js";
import { createTestLogger } from "../src/createTestLogger.js";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const setup = (): { dir: string; cleanup: () => void } => {
  const dir = join(tmpdir(), `tools-cleanup-${crypto.randomUUID()}`);
  mkdirSync(dir, { recursive: true });
  return {
    dir,
    cleanup: () => {
      if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    },
  };
};

const PREFIX = ".tmp_test-";

describe("cleanupOrphanedTempDirs", () => {
  it("removes directories matching the prefix", async () => {
    const { dir, cleanup } = setup();
    try {
      const orphan = join(dir, `${PREFIX}abc`);
      mkdirSync(orphan);
      const { logger } = createTestLogger();
      await cleanupOrphanedTempDirs(dir, PREFIX, logger);
      expect(existsSync(orphan)).toBe(false);
    } finally {
      cleanup();
    }
  });

  it("removes multiple orphaned directories in parallel", async () => {
    const { dir, cleanup } = setup();
    try {
      const a = join(dir, `${PREFIX}a`);
      const b = join(dir, `${PREFIX}b`);
      const c = join(dir, `${PREFIX}c`);
      [a, b, c].forEach((d) => mkdirSync(d));
      const { logger, logs } = createTestLogger();
      await cleanupOrphanedTempDirs(dir, PREFIX, logger);
      expect(existsSync(a)).toBe(false);
      expect(existsSync(b)).toBe(false);
      expect(existsSync(c)).toBe(false);
      expect(logs.length).toBe(3);
    } finally {
      cleanup();
    }
  });

  it("ignores directories not matching the prefix", async () => {
    const { dir, cleanup } = setup();
    try {
      const keep = join(dir, "keep-me");
      const orphan = join(dir, `${PREFIX}gone`);
      mkdirSync(keep);
      mkdirSync(orphan);
      const { logger } = createTestLogger();
      await cleanupOrphanedTempDirs(dir, PREFIX, logger);
      expect(existsSync(keep)).toBe(true);
      expect(existsSync(orphan)).toBe(false);
    } finally {
      cleanup();
    }
  });

  it("only removes directories, not files matching prefix", async () => {
    const { dir, cleanup } = setup();
    try {
      const file = join(dir, `${PREFIX}file.txt`);
      const innerDir = join(dir, `${PREFIX}dir`);
      writeFileSync(file, "content");
      mkdirSync(innerDir);
      const { logger } = createTestLogger();
      await cleanupOrphanedTempDirs(dir, PREFIX, logger);
      expect(existsSync(file)).toBe(true);
      expect(existsSync(innerDir)).toBe(false);
    } finally {
      cleanup();
    }
  });

  it("handles empty directory without error", async () => {
    const { dir, cleanup } = setup();
    try {
      const { logger } = createTestLogger();
      await cleanupOrphanedTempDirs(dir, PREFIX, logger);
      expect(existsSync(dir)).toBe(true);
    } finally {
      cleanup();
    }
  });

  it("handles non-existent directory gracefully", async () => {
    const { dir, cleanup } = setup();
    try {
      const nonExistent = join(dir, "does-not-exist");
      const { logger } = createTestLogger();
      await cleanupOrphanedTempDirs(nonExistent, PREFIX, logger);
    } finally {
      cleanup();
    }
  });

  it("logs a message for each removed directory", async () => {
    const { dir, cleanup } = setup();
    try {
      mkdirSync(join(dir, `${PREFIX}one`));
      const { logger, logs } = createTestLogger();
      await cleanupOrphanedTempDirs(dir, PREFIX, logger);
      expect(logs.length).toBe(1);
      expect(logs[0]).toContain(`${PREFIX}one`);
    } finally {
      cleanup();
    }
  });

  it("supports different prefixes independently", async () => {
    const { dir, cleanup } = setup();
    try {
      const a = join(dir, ".alt-a");
      const b = join(dir, ".alt-b");
      const other = join(dir, ".other-x");
      [a, b, other].forEach((d) => mkdirSync(d));
      const { logger } = createTestLogger();
      await cleanupOrphanedTempDirs(dir, ".alt-", logger);
      expect(existsSync(a)).toBe(false);
      expect(existsSync(b)).toBe(false);
      expect(existsSync(other)).toBe(true);
    } finally {
      cleanup();
    }
  });
});
