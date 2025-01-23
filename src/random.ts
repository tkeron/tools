export function* rng(seed = 0, limit = 0) {
  let current = 0;
  while (true) {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    yield seed;
    if (limit > 0) current++;
    if (limit > 0 && current >= limit) break;
  }
}
