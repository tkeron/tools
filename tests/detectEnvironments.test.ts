import { describe, it, expect } from "bun:test";
import { detectEnvironments } from "../src/detectEnvironments.js";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const setup = (): { dir: string; cleanup: () => void } => {
  const dir = join(tmpdir(), `tools-detectenv-${crypto.randomUUID()}`);
  mkdirSync(dir, { recursive: true });
  return {
    dir,
    cleanup: () => {
      if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    },
  };
};

describe("detectEnvironments", () => {
  it("returns empty array when no known environment directories exist", () => {
    const { dir, cleanup } = setup();
    try {
      expect(detectEnvironments(dir)).toEqual([]);
    } finally {
      cleanup();
    }
  });

  it("detects .cursor/ directory as cursor environment", () => {
    const { dir, cleanup } = setup();
    try {
      mkdirSync(join(dir, ".cursor"), { recursive: true });
      expect(detectEnvironments(dir)).toContainEqual({
        env: "cursor",
        target: ".cursor/rules",
      });
    } finally {
      cleanup();
    }
  });

  it("detects .github/ directory as copilot environment", () => {
    const { dir, cleanup } = setup();
    try {
      mkdirSync(join(dir, ".github"), { recursive: true });
      expect(detectEnvironments(dir)).toContainEqual({
        env: "copilot",
        target: ".github/skills",
      });
    } finally {
      cleanup();
    }
  });

  it("detects .claude/ directory as claude environment", () => {
    const { dir, cleanup } = setup();
    try {
      mkdirSync(join(dir, ".claude"), { recursive: true });
      expect(detectEnvironments(dir)).toContainEqual({
        env: "claude",
        target: ".claude/rules",
      });
    } finally {
      cleanup();
    }
  });

  it("detects CLAUDE.md file as claude environment", () => {
    const { dir, cleanup } = setup();
    try {
      writeFileSync(join(dir, "CLAUDE.md"), "# Instructions");
      expect(detectEnvironments(dir)).toContainEqual({
        env: "claude",
        target: ".claude/rules",
      });
    } finally {
      cleanup();
    }
  });

  it("does not duplicate claude when both .claude/ and CLAUDE.md exist", () => {
    const { dir, cleanup } = setup();
    try {
      mkdirSync(join(dir, ".claude"), { recursive: true });
      writeFileSync(join(dir, "CLAUDE.md"), "# Instructions");
      const result = detectEnvironments(dir);
      expect(result.filter((r) => r.env === "claude")).toHaveLength(1);
    } finally {
      cleanup();
    }
  });

  it("detects multiple environments simultaneously", () => {
    const { dir, cleanup } = setup();
    try {
      mkdirSync(join(dir, ".cursor"), { recursive: true });
      mkdirSync(join(dir, ".github"), { recursive: true });
      mkdirSync(join(dir, ".claude"), { recursive: true });
      const result = detectEnvironments(dir);
      expect(result).toHaveLength(3);
      expect(result.map((r) => r.env)).toContain("cursor");
      expect(result.map((r) => r.env)).toContain("copilot");
      expect(result.map((r) => r.env)).toContain("claude");
    } finally {
      cleanup();
    }
  });

  it("returns only cursor when only .cursor/ exists", () => {
    const { dir, cleanup } = setup();
    try {
      mkdirSync(join(dir, ".cursor"), { recursive: true });
      const result = detectEnvironments(dir);
      expect(result).toHaveLength(1);
      expect(result[0].env).toBe("cursor");
    } finally {
      cleanup();
    }
  });
});
