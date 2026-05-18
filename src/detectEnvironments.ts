import { existsSync } from "fs";
import { join } from "path";

export type Environment = "copilot" | "cursor" | "claude";

export interface DetectedEnvironment {
  env: Environment;
  target: string;
}

export const detectEnvironments = (cwd: string): DetectedEnvironment[] => {
  const results: DetectedEnvironment[] = [];

  if (existsSync(join(cwd, ".cursor"))) {
    results.push({ env: "cursor", target: ".cursor/rules" });
  }

  if (existsSync(join(cwd, ".github"))) {
    results.push({ env: "copilot", target: ".github/skills" });
  }

  if (existsSync(join(cwd, ".claude")) || existsSync(join(cwd, "CLAUDE.md"))) {
    results.push({ env: "claude", target: ".claude/rules" });
  }

  return results;
};
