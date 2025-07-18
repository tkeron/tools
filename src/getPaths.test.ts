import { describe, test, expect, beforeAll, afterAll, it } from "bun:test";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { getPaths, getFilePaths, getDirectoryPaths } from "./getPaths";

const testDir = join(process.cwd(), "test-temp");

describe("getPaths Tests", () => {

    beforeAll(() => {
        mkdirSync(testDir, { recursive: true });

        writeFileSync(join(testDir, "file1.txt"), "content");
        writeFileSync(join(testDir, "file2.js"), "content");
        writeFileSync(join(testDir, "README.md"), "content");

        mkdirSync(join(testDir, "src"), { recursive: true });
        writeFileSync(join(testDir, "src", "index.ts"), "content");
        writeFileSync(join(testDir, "src", "utils.ts"), "content");

        mkdirSync(join(testDir, "docs"), { recursive: true });
        writeFileSync(join(testDir, "docs", "guide.md"), "content");

        mkdirSync(join(testDir, "empty-dir"), { recursive: true });

        mkdirSync(join(testDir, "src", "components"), { recursive: true });
        writeFileSync(join(testDir, "src", "components", "Button.tsx"), "content");

        writeFileSync(join(testDir, ".env"), "content");
        mkdirSync(join(testDir, ".git"), { recursive: true });
        writeFileSync(join(testDir, ".git", "config"), "content");

        writeFileSync(join(testDir, "file with spaces.txt"), "content");
        writeFileSync(join(testDir, "file-no-extension"), "content");
        writeFileSync(join(testDir, "UPPERCASE.TXT"), "content");
        writeFileSync(join(testDir, "números-ñ-ü.js"), "content");

        writeFileSync(join(testDir, "config.json"), "content");
        writeFileSync(join(testDir, "styles.css"), "content");
        writeFileSync(join(testDir, "script.jsx"), "content");

        mkdirSync(join(testDir, "deep", "very", "nested", "structure"), { recursive: true });
        writeFileSync(join(testDir, "deep", "very", "nested", "structure", "deep-file.txt"), "content");

        mkdirSync(join(testDir, "node_modules"), { recursive: true });
        writeFileSync(join(testDir, "node_modules", "package.json"), "content");
        mkdirSync(join(testDir, "build"), { recursive: true });
        writeFileSync(join(testDir, "build", "output.js"), "content");

        for (let i = 123; i <= 129; i++) {
            mkdirSync(join(testDir, `build`, `qwerty_${i}.com`), { recursive: true });
        }
    });

    afterAll(() => {
        rmSync(testDir, { recursive: true, force: true });
    });

    describe("getPaths", () => {
        test("should return both files and directories when includeDirectories is 'yes'", () => {
            const result = getPaths(testDir, "**/*", "yes");

            expect(result.length).toBeGreaterThan(0);
            expect(result.some(path => path.includes("file1.txt"))).toBe(true);
            expect(result.some(path => path.includes("src"))).toBe(true);
            expect(result.some(path => path.includes("docs"))).toBe(true);
        });

        test("should return only files when includeDirectories is 'no'", () => {
            const result = getPaths(testDir, "**/*", "no");

            expect(result.length).toBeGreaterThan(0);
            expect(result.some(path => path.includes("file1.txt"))).toBe(true);
            expect(result.some(path => path.includes("index.ts"))).toBe(true);
            expect(result.some(path => path.endsWith("src"))).toBe(false);
            expect(result.some(path => path.endsWith("docs"))).toBe(false);
        });

        test("should return only directories when includeDirectories is 'onlyDirectories'", () => {
            const result = getPaths(testDir, "**/*", "onlyDirectories");

            expect(result.length).toBeGreaterThan(0);
            expect(result.some(path => path.endsWith("src"))).toBe(true);
            expect(result.some(path => path.endsWith("docs"))).toBe(true);
            expect(result.some(path => path.endsWith("empty-dir"))).toBe(true);
            expect(result.some(path => path.includes("file1.txt"))).toBe(false);
            expect(result.some(path => path.includes("index.ts"))).toBe(false);
        });

        test("should use default includeDirectories value ('no')", () => {
            const result = getPaths(testDir, "**/*");
            const filesOnlyResult = getPaths(testDir, "**/*", "no");

            expect(result).toEqual(filesOnlyResult);
        });

        test("should work with specific patterns", () => {
            const result = getPaths(testDir, "*.txt", "no");

            expect(result.some(path => path.includes("file1.txt"))).toBe(true);
            expect(result.some(path => path.includes("file2.js"))).toBe(false);
            expect(result.some(path => path.includes("README.md"))).toBe(false);
        });

        test("should include hidden files and directories", () => {
            const allResult = getPaths(testDir, "**/*", "yes");

            expect(allResult.some(path => path.includes(".env"))).toBe(true);
            expect(allResult.some(path => path.includes(".git"))).toBe(true);
        });

        test("should return empty array for non-existent path", () => {
            const result = getPaths("/non/existent/path", "**/*", "yes");

            expect(result).toEqual([]);
        });
    });

    describe("getFilePaths", () => {
        test("should return only files", () => {
            const result = getFilePaths(testDir, "**/*");

            expect(result.length).toBeGreaterThan(0);
            expect(result.some(path => path.includes("file1.txt"))).toBe(true);
            expect(result.some(path => path.includes("index.ts"))).toBe(true);
            expect(result.some(path => path.includes("Button.tsx"))).toBe(true);
            expect(result.some(path => path.endsWith("src"))).toBe(false);
            expect(result.some(path => path.endsWith("docs"))).toBe(false);
        });

        test("should work with specific file patterns", () => {
            const jsFiles = getFilePaths(testDir, "**/*.js");
            const tsFiles = getFilePaths(testDir, "**/*.ts");

            expect(jsFiles.some(path => path.includes("file2.js"))).toBe(true);
            expect(jsFiles.some(path => path.includes("file1.txt"))).toBe(false);

            expect(tsFiles.some(path => path.includes("index.ts"))).toBe(true);
            expect(tsFiles.some(path => path.includes("utils.ts"))).toBe(true);
        });

        test("should include hidden files", () => {
            const result = getFilePaths(testDir, "**/*");

            expect(result.some(path => path.includes(".env"))).toBe(true);
            expect(result.some(path => path.includes(".git/config"))).toBe(true);
        });

        test("should return empty array for non-existent path", () => {
            const result = getFilePaths("/non/existent/path", "**/*");

            expect(result).toEqual([]);
        });
    });

    describe("getDirectoryPaths", () => {
        test("should return only directories", () => {
            const result = getDirectoryPaths(testDir, "**/*");

            expect(result.length).toBeGreaterThan(0);
            expect(result.some(path => path.endsWith("src"))).toBe(true);
            expect(result.some(path => path.endsWith("docs"))).toBe(true);
            expect(result.some(path => path.endsWith("empty-dir"))).toBe(true);
            expect(result.some(path => path.endsWith("components"))).toBe(true);
            expect(result.some(path => path.includes("file1.txt"))).toBe(false);
            expect(result.some(path => path.includes("index.ts"))).toBe(false);
        });

        test("should include hidden directories", () => {
            const result = getDirectoryPaths(testDir, "**/*");

            expect(result.some(path => path.includes(".git"))).toBe(true);
        });

        test("should work with directory patterns", () => {
            const result = getDirectoryPaths(testDir, "src/**");

            expect(result.some(path => path.endsWith("components"))).toBe(true);
            expect(result.some(path => path.endsWith("docs"))).toBe(false);
        });

        test("should return empty array for non-existent path", () => {
            const result = getDirectoryPaths("/non/existent/path", "**/*");

            expect(result).toEqual([]);
        });
    });

    describe("Edge cases", () => {
        test("should handle empty directory", () => {
            const emptyDirPath = join(testDir, "empty-dir");
            const files = getFilePaths(emptyDirPath, "**/*");
            const dirs = getDirectoryPaths(emptyDirPath, "**/*");

            expect(files).toEqual([]);
            expect(dirs).toEqual([]);
        });

        test("should handle invalid glob patterns gracefully", () => {
            const result = getPaths(testDir, "[invalid", "yes");

            expect(Array.isArray(result)).toBe(true);
        });

        test("all functions should return absolute paths by default", () => {
            const files = getFilePaths(testDir, "**/*");
            const dirs = getDirectoryPaths(testDir, "**/*");
            const all = getPaths(testDir, "**/*", "yes");

            files.forEach(path => {
                expect(path).toMatch(/^[\/\\]|^[a-zA-Z]:[\/\\]/);
            });

            dirs.forEach(path => {
                expect(path).toMatch(/^[\/\\]|^[a-zA-Z]:[\/\\]/);
            });

            all.forEach(path => {
                expect(path).toMatch(/^[\/\\]|^[a-zA-Z]:[\/\\]/);
            });
        });

        test("all functions should return relative paths when absolute is false", () => {
            const files = getFilePaths(testDir, "**/*", false);
            const dirs = getDirectoryPaths(testDir, "**/*", false);
            const all = getPaths(testDir, "**/*", "yes", false);

            files.forEach(path => {
                expect(path).not.toMatch(/^[\/\\]|^[a-zA-Z]:[\/\\]/);
                expect(path.length).toBeGreaterThan(0);
            });

            dirs.forEach(path => {
                expect(path).not.toMatch(/^[\/\\]|^[a-zA-Z]:[\/\\]/);
                expect(path.length).toBeGreaterThan(0);
            });

            all.forEach(path => {
                expect(path).not.toMatch(/^[\/\\]|^[a-zA-Z]:[\/\\]/);
                expect(path.length).toBeGreaterThan(0);
            });
        });

        test("relative paths should contain expected file and directory names", () => {
            const files = getFilePaths(testDir, "**/*", false);
            const dirs = getDirectoryPaths(testDir, "**/*", false);

            expect(files.some(path => path === "file1.txt")).toBe(true);
            expect(files.some(path => path === ".env")).toBe(true);
            expect(files.some(path => path === "src/index.ts")).toBe(true);
            expect(files.some(path => path === "src/components/Button.tsx")).toBe(true);

            const nestedFiles = files.filter(path => path.includes("/"));
            expect(nestedFiles.length).toBeGreaterThan(0);

            expect(dirs.some(path => path === "src")).toBe(true);
            expect(dirs.some(path => path === ".git")).toBe(true);

            expect(dirs.length).toBeGreaterThan(0);
        });

        test("absolute parameter should work consistently across all function variants", () => {
            const pattern = "src/**";


            const absoluteFiles = getFilePaths(testDir, pattern, true);
            const absoluteDirs = getDirectoryPaths(testDir, pattern, true);
            const absoluteAll = getPaths(testDir, pattern, "yes", true);

            const relativeFiles = getFilePaths(testDir, pattern, false);
            const relativeDirs = getDirectoryPaths(testDir, pattern, false);
            const relativeAll = getPaths(testDir, pattern, "yes", false);

            expect(absoluteFiles.length).toBe(relativeFiles.length);
            expect(absoluteAll.length).toBe(relativeAll.length);

            expect(Array.isArray(absoluteDirs)).toBe(true);
            expect(Array.isArray(relativeDirs)).toBe(true);

            absoluteFiles.forEach(path => {
                expect(path).toMatch(/^[\/\\]|^[a-zA-Z]:[\/\\]/);
            });

            relativeFiles.forEach(path => {
                expect(path).not.toMatch(/^[\/\\]|^[a-zA-Z]:[\/\\]/);
            });
        });
    });

    describe("Advanced Glob Patterns", () => {
        test("should work with multiple extension patterns", () => {
            const result = getFilePaths(testDir, "*.{js,ts,json}");

            expect(result.some(path => path.includes("file2.js"))).toBe(true);
            expect(result.some(path => path.includes("config.json"))).toBe(true);
            expect(result.some(path => path.includes("números-ñ-ü.js"))).toBe(true);
            expect(result.some(path => path.includes("file1.txt"))).toBe(false);
            expect(result.some(path => path.includes("styles.css"))).toBe(false);
        });

        test("should work with exclusion patterns", () => {
            const allFiles = getFilePaths(testDir, "**/*");
            expect(allFiles.some(path => path.includes("node_modules"))).toBe(true);
            expect(allFiles.some(path => path.includes("build"))).toBe(true);
        });

        test("should work with specific directory depth patterns", () => {
            const topLevel = getFilePaths(testDir, "*");
            expect(topLevel.some(path => path.includes("file1.txt"))).toBe(true);
            expect(topLevel.some(path => path.includes("index.ts"))).toBe(false);

            const srcFiles = getFilePaths(testDir, "src/*");
            expect(srcFiles.some(path => path.includes("index.ts"))).toBe(true);
            expect(srcFiles.some(path => path.includes("Button.tsx"))).toBe(false);
        });

        test("should work with character class patterns", () => {
            const result = getFilePaths(testDir, "*[Ee]*");

            expect(result.some(path => path.includes("README.md"))).toBe(true);
            expect(result.some(path => path.includes(".env"))).toBe(true);
        });

        test("should work with case sensitive patterns", () => {
            const upperFiles = getFilePaths(testDir, "*.TXT");
            const lowerFiles = getFilePaths(testDir, "*.txt");

            expect(upperFiles.some(path => path.includes("UPPERCASE.TXT"))).toBe(true);
            expect(lowerFiles.some(path => path.includes("file1.txt"))).toBe(true);

            expect(upperFiles).not.toEqual(lowerFiles);
        });

        test("should handle patterns that match nothing", () => {
            const result = getFilePaths(testDir, "*.nonexistent");
            expect(result).toEqual([]);

            const dirs = getDirectoryPaths(testDir, "nonexistent-*");
            expect(dirs).toEqual([]);
        });

        test("should work with deep nested patterns", () => {
            const deepFiles = getFilePaths(testDir, "**/very/**/*.txt");
            expect(deepFiles.some(path => path.includes("deep-file.txt"))).toBe(true);

            const deepDirs = getDirectoryPaths(testDir, "**/very/**");
            expect(deepDirs.some(path => path.endsWith("nested"))).toBe(true);
            expect(deepDirs.some(path => path.endsWith("structure"))).toBe(true);
        });
    });

    describe("Function Consistency", () => {
        test("getPaths('yes') should equal getFilePaths() + getDirectoryPaths()", () => {
            const pattern = "**/*";

            const allPaths = getPaths(testDir, pattern, "yes");
            const files = getFilePaths(testDir, pattern);
            const dirs = getDirectoryPaths(testDir, pattern);

            const combined = [...files, ...dirs].sort();
            const allSorted = allPaths.sort();

            expect(allSorted).toEqual(combined);
        });

        test("should not have duplicates in any function", () => {
            const files = getFilePaths(testDir, "**/*");
            const dirs = getDirectoryPaths(testDir, "**/*");
            const all = getPaths(testDir, "**/*", "yes");

            expect(files.length).toBe(new Set(files).size);
            expect(dirs.length).toBe(new Set(dirs).size);
            expect(all.length).toBe(new Set(all).size);
        });

        test("files and directories should be mutually exclusive", () => {
            const files = getFilePaths(testDir, "**/*");
            const dirs = getDirectoryPaths(testDir, "**/*");

            const intersection = files.filter(file => dirs.includes(file));
            expect(intersection).toEqual([]);
        });

        test("different patterns should be consistent across functions", () => {
            const patterns = ["*.js", "src/**", "**/*.md", "**/components/*"];

            patterns.forEach(pattern => {
                const allPaths = getPaths(testDir, pattern, "yes");
                const files = getFilePaths(testDir, pattern);
                const dirs = getDirectoryPaths(testDir, pattern);

                files.forEach(file => {
                    expect(allPaths).toContain(file);
                });

                dirs.forEach(dir => {
                    expect(allPaths).toContain(dir);
                });
            });
        });

        test("should maintain consistent behavior with default parameters", () => {
            const result1 = getPaths(testDir);
            const result2 = getPaths(testDir, "**/*");
            const result3 = getPaths(testDir, "**/*", "no");
            const result4 = getFilePaths(testDir);
            const result5 = getFilePaths(testDir, "**/*");

            expect(result1).toEqual(result2);
            expect(result2).toEqual(result3);
            expect(result3).toEqual(result4);
            expect(result4).toEqual(result5);
        });
    });

    describe("Special File Names", () => {
        test("should handle files with spaces", () => {
            const files = getFilePaths(testDir, "**/*");
            expect(files.some(path => path.includes("file with spaces.txt"))).toBe(true);

            const specific = getFilePaths(testDir, "*with*");
            expect(specific.some(path => path.includes("file with spaces.txt"))).toBe(true);
        });

        test("should handle files without extensions", () => {
            const files = getFilePaths(testDir, "**/*");
            expect(files.some(path => path.includes("file-no-extension"))).toBe(true);

            const withExt = getFilePaths(testDir, "*.txt");
            expect(withExt.some(path => path.includes("file-no-extension"))).toBe(false);
        });

        test("should handle files with unicode characters", () => {
            const files = getFilePaths(testDir, "**/*");
            expect(files.some(path => path.includes("números-ñ-ü.js"))).toBe(true);

            const jsFiles = getFilePaths(testDir, "*.js");
            expect(jsFiles.some(path => path.includes("números-ñ-ü.js"))).toBe(true);
        });

        test("should handle uppercase/lowercase variations", () => {
            const files = getFilePaths(testDir, "**/*");
            expect(files.some(path => path.includes("UPPERCASE.TXT"))).toBe(true);
            expect(files.some(path => path.includes("file1.txt"))).toBe(true);

            const upper = getFilePaths(testDir, "*UPPER*");
            const lower = getFilePaths(testDir, "*upper*");
            expect(upper.length).toBeGreaterThan(0);
            expect(lower).toEqual([]);
        });

        test("should handle various file extensions", () => {
            const extensions = ["js", "ts", "tsx", "json", "css", "jsx", "md", "txt"];

            extensions.forEach(ext => {
                const files = getFilePaths(testDir, `*.${ext}`);
                expect(Array.isArray(files)).toBe(true);
            });

            expect(getFilePaths(testDir, "*.css").some(path => path.includes("styles.css"))).toBe(true);
            expect(getFilePaths(testDir, "*.jsx").some(path => path.includes("script.jsx"))).toBe(true);
        });

        test("should handle deeply nested paths correctly", () => {
            const deepFiles = getFilePaths(testDir, "**/structure/*");
            expect(deepFiles.some(path => path.includes("deep-file.txt"))).toBe(true);

            const deepDirs = getDirectoryPaths(testDir, "**/very/*");
            expect(deepDirs.some(path => path.endsWith("nested"))).toBe(true);

            const allDeep = getPaths(testDir, "deep/**", "yes");
            expect(allDeep.length).toBeGreaterThanOrEqual(4);
        });

        test("should normalize paths consistently", () => {
            const files = getFilePaths(testDir, "**/*");
            const dirs = getDirectoryPaths(testDir, "**/*");

            files.forEach(file => {
                expect(file).toMatch(/^[\/\\]|^[a-zA-Z]:[\/\\]/);
                expect(file).not.toMatch(/[\/\\]$/);
            });

            dirs.forEach(dir => {
                expect(dir).toMatch(/^[\/\\]|^[a-zA-Z]:[\/\\]/);
            });
        });



        test("should return the same number of paths with absolute false or true", () => {

            const absolutes = getDirectoryPaths(testDir, "build/qwerty_*", true);
            const notAbsolutes = getDirectoryPaths(testDir, "build/qwerty_*", false);


            console.log(JSON.stringify({ absolutes, notAbsolutes }, null, 2));

            expect(absolutes).toHaveLength(7);
            expect(notAbsolutes).toHaveLength(7);


        });

    });




})



