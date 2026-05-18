import { describe, it, expect, spyOn } from "bun:test";
import { promptUser } from "../src/promptUser.js";

const mockReadline = (answer: string) => ({
  createInterface: () => ({
    question: (_q: string, callback: (a: string) => void) => callback(answer),
    close: () => {},
  }),
});

const withMockedAnswer = async (answer: string): Promise<boolean> => {
  const readlineModule = await import("readline");
  const spy = spyOn(readlineModule, "createInterface").mockImplementation(
    mockReadline(answer).createInterface as any,
  );
  try {
    return await promptUser("Test question? ");
  } finally {
    spy?.mockRestore();
  }
};

describe("promptUser", () => {
  it("returns true when user inputs 'y'", async () => {
    expect(await withMockedAnswer("y")).toBe(true);
  });

  it("returns true when user inputs 'yes'", async () => {
    expect(await withMockedAnswer("yes")).toBe(true);
  });

  it("returns true when user inputs 'Y' (uppercase)", async () => {
    expect(await withMockedAnswer("Y")).toBe(true);
  });

  it("returns true when user inputs 'YES' (uppercase)", async () => {
    expect(await withMockedAnswer("YES")).toBe(true);
  });

  it("returns false when user inputs 'n'", async () => {
    expect(await withMockedAnswer("n")).toBe(false);
  });

  it("returns false when user inputs 'no'", async () => {
    expect(await withMockedAnswer("no")).toBe(false);
  });

  it("returns false when user inputs empty string", async () => {
    expect(await withMockedAnswer("")).toBe(false);
  });

  it("returns false when user inputs random text", async () => {
    expect(await withMockedAnswer("random")).toBe(false);
  });

  it("trims whitespace from user input", async () => {
    expect(await withMockedAnswer("  y  ")).toBe(true);
  });
});
