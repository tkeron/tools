import { describe, it, expect } from "bun:test";
import { rng } from "../src/random.js";

describe("testing rng", () => {
  it("should return the same 10 random numbers for seed=344", () => {
    const numbers = [...rng(344, 10)];
    const expected = [
      88811757, 1786880006, -1901549690, -783089686, 1532981021, 1629592611,
      102726481, -941665653, -1672827444, -141168747,
    ];
    expect(numbers).toEqual(expected);
  });

  it("should return the same 100 random numbers for seed=158484", () => {
    const numbers = [...rng(158484, 100)];
    const expected = [
      -512132828, 98688842, -15169138, 721513946, -771752345, -397269314,
      1010577276, -2086534859, -1290576361, -1025237601, 1806465972, 2139370233,
      -1028051820, 39829281, 1120459388, 1768530271, -183529410, -436067078,
      -248249548, 1527105597, -1571897668, -960918928, 151404779, -495137626,
      116267794, 1946452820, 1773133059, -738265980, -1600113581, 1667592070,
      472076620, -1218993303, 611253364, -2014334716, 1210987907, 1565772620,
      -1552845967, 787622462, 487465828, -181095051, 283030456, 329010540,
      -603058444, -1480555620, 1104662757, -1029632768, -2094961536, 2023342296,
      1356788665, 1536461133, -1659154829, 1852856121, -159388878, 1747745150,
      125113631, 521001332, 541976517, 169589375, -673644939, -891357762,
      -1722888502, 1382186657, -1417912518, 872079767, -1764820973, 1885020757,
      -1776253955, 1304230546, -1891946683, -1331478612, 1032049895,
      -1526859160, 1840120240, 513620220, -1982733411, 32420044, 689159639,
      -1954077981, -1800022834, -341018408, -228713757, 290336290, 1170540679,
      2120828749, -2036773459, 1253342555, 1727989076, 1289914814, -1484935724,
      1243853399, -1321156605, -2125340477, 343773831, 1669764017, -1881013655,
      977826430, -1259165731, -517468935, -162314014, 1990733797,
    ];
    expect(numbers).toEqual(expected);
  });
  it.skip("should return info about series of 98688842", () => {
    const seed = 98688842;
    const gen = rng(seed);
    const info = {
      seed,
      period: 0,
      max: Number.MIN_SAFE_INTEGER,
      min: Number.MAX_SAFE_INTEGER,
      minPositive: Number.MAX_SAFE_INTEGER,
      maxNegative: Number.MIN_SAFE_INTEGER,
    };
    while (true) {
      const num = gen.next().value!;

      if (num > info.max) info.max = num;
      if (num < info.min) info.min = num;

      if (num > 0 && num < info.minPositive) info.minPositive = num;
      if (num < 0 && num > info.maxNegative) info.maxNegative = num;

      info.period++;

      if (num === seed) break;
    }

    console.log(JSON.stringify(info, null, 4));

    expect(info).toEqual({
      seed: 98688842,
      period: 1073741822,
      max: 2147483647,
      min: -2147483646,
      minPositive: 1,
      maxNegative: -4,
    });
  });
  it.skip("should return info about series of numbers...", () => {
    const seeds = [1, 4, 8];
    const gens = seeds.map((s) => rng(s));
    const infos = seeds.map((seed) => ({
      seed,
      period: 0,
      max: Number.MIN_SAFE_INTEGER,
      min: Number.MAX_SAFE_INTEGER,
      minPositive: Number.MAX_SAFE_INTEGER,
      maxNegative: Number.MIN_SAFE_INTEGER,
    }));
    let i = 0;
    while (true) {
      const info = infos[i];
      const gen = gens[i];
      const seed = seeds[i];

      const num = gen.next().value!;

      if (num > info.max) info.max = num;
      if (num < info.min) info.min = num;

      if (num > 0 && num < info.minPositive) info.minPositive = num;
      if (num < 0 && num > info.maxNegative) info.maxNegative = num;

      info.period++;

      if (num === seed) break;

      i++;
      if (i >= seeds.length) i = 0;
    }

    console.log(JSON.stringify(infos, null, 4));

    expect(infos).toEqual([
      {
        seed: 1,
        period: 1073741822,
        max: 2147483647,
        min: -2147483646,
        minPositive: 1,
        maxNegative: -4,
      },
      {
        seed: 4,
        period: 1073741821,
        max: 2147483647,
        min: -2147483646,
        minPositive: 1,
        maxNegative: -4,
      },
      {
        seed: 8,
        period: 1073741821,
        max: 2147483647,
        min: -2147483646,
        minPositive: 1,
        maxNegative: -4,
      },
    ]);
  });
});
