import { describe, it, expect } from "bun:test";
import { addFrontmatterField } from "../src/addFrontmatterField.js";

describe("addFrontmatterField", () => {
  it("adds a boolean field to frontmatter", () => {
    const content = '---\nname: tool\ndescription: "Test"\n---\n\n# Content';
    const result = addFrontmatterField(content, "alwaysApply", false);
    expect(result).toContain("alwaysApply: false");
    expect(result).toContain("name: tool");
    expect(result).toContain("# Content");
  });

  it("adds a string field to frontmatter", () => {
    const content = '---\nname: tool\ndescription: "Test"\n---\n\n# Content';
    const result = addFrontmatterField(content, "globs", "**/*.ts");
    expect(result).toContain("globs: **/*.ts");
    expect(result).toContain("name: tool");
  });

  it("places added field before closing ---", () => {
    const content = "---\nname: tool\n---\n\n# Content";
    const result = addFrontmatterField(content, "alwaysApply", false);
    const closingIndex = result.indexOf("\n---\n");
    const fieldIndex = result.indexOf("alwaysApply: false");
    expect(fieldIndex).toBeGreaterThan(0);
    expect(fieldIndex).toBeLessThan(closingIndex);
  });

  it("returns content unchanged if field already exists", () => {
    const content = "---\nname: tool\nalwaysApply: true\n---\n\n# Content";
    const result = addFrontmatterField(content, "alwaysApply", false);
    expect(result).toBe(content);
  });

  it("returns content unchanged when no frontmatter present", () => {
    const content = "# Content without frontmatter";
    const result = addFrontmatterField(content, "alwaysApply", false);
    expect(result).toBe(content);
  });

  it("returns content unchanged when frontmatter is not closed", () => {
    const content = "---\nname: tool\n# No closing markers";
    const result = addFrontmatterField(content, "alwaysApply", false);
    expect(result).toBe(content);
  });

  it("preserves all content after frontmatter", () => {
    const content =
      "---\nname: tool\n---\n\n# Long content\n\nWith multiple paragraphs.";
    const result = addFrontmatterField(content, "alwaysApply", false);
    expect(result).toContain("# Long content\n\nWith multiple paragraphs.");
  });

  it("does not add duplicate when called twice with same key", () => {
    const content = "---\nname: tool\n---\n\n# Content";
    const once = addFrontmatterField(content, "alwaysApply", false);
    const twice = addFrontmatterField(once, "alwaysApply", true);
    expect(twice).toBe(once);
    const count = (twice.match(/alwaysApply:/g) || []).length;
    expect(count).toBe(1);
  });
});
