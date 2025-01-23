import { describe, it, expect } from "bun:test";
import { getFIFO } from "./stack";
import { getLIFO } from "./stack";

describe("LIFO stack tests", () => {
  it("should create an empty lifo stack", () => {
    const lifo = getLIFO<number>();
    expect(lifo.length).toBe(0);
    expect(lifo.current).toBe(null);
  });

  it("should push an item to the lifo stack", () => {
    const lifo = getLIFO<number>();
    lifo.push(1);
    expect(lifo.length).toBe(1);
    expect(lifo.current).toBe(1);
  });

  it("should pop an item from the lifo stack", () => {
    const lifo = getLIFO<number>();
    lifo.push(1);
    expect(lifo.current).toBe(1);
    expect(lifo.pop()).toBe(1);
    expect(lifo.length).toBe(0);
    expect(lifo.current).toBe(null);
  });

  it("should push multiple items to the lifo stack", () => {
    const lifo = getLIFO<number>();
    lifo.push(1);
    lifo.push(2);
    lifo.push(3);
    expect(lifo.length).toBe(3);
    expect(lifo.current).toBe(3);
  });

  it("should pop multiple items from the lifo stack", () => {
    const lifo = getLIFO<number>();
    lifo.push(1);
    lifo.push(2);
    lifo.push(3);
    expect(lifo.pop()).toBe(3);
    expect(lifo.pop()).toBe(2);
    expect(lifo.pop()).toBe(1);
    expect(lifo.length).toBe(0);
    expect(lifo.current).toBe(null);
  });

  it("verify LIFO behavior with direct current modification", () => {
    const lifo = getLIFO<number>();
    lifo.push(1);
    lifo.push(2);
    lifo.current = 3;
    expect(lifo.length).toBe(2);
    expect(lifo.current).toBe(3);
  });
});

describe("FIFO stack tests", () => {
  it("should create an empty fifo stack", () => {
    const fifo = getFIFO<number>();
    expect(fifo.length).toBe(0);
    expect(fifo.current).toBe(null);
  });

  it("should push an item to the fifo stack", () => {
    const fifo = getFIFO<number>();
    fifo.push(1);
    expect(fifo.length).toBe(1);
    expect(fifo.current).toBe(1);
  });

  it("should pop an item from the fifo stack", () => {
    const fifo = getFIFO<number>();
    fifo.push(1);
    expect(fifo.current).toBe(1);
    expect(fifo.pop()).toBe(1);
    expect(fifo.length).toBe(0);
    expect(fifo.current).toBe(null);
  });

  it("should push multiple items to the fifo stack", () => {
    const fifo = getFIFO<number>();
    fifo.push(1);
    fifo.push(2);
    fifo.push(3);
    expect(fifo.length).toBe(3);
    expect(fifo.current).toBe(1);
  });

  it("should pop multiple items from the fifo stack", () => {
    const fifo = getFIFO<number>();
    fifo.push(1);
    fifo.push(2);
    fifo.push(3);
    expect(fifo.pop()).toBe(1);
    expect(fifo.pop()).toBe(2);
    expect(fifo.pop()).toBe(3);
    expect(fifo.length).toBe(0);
    expect(fifo.current).toBe(null);
  });
});
