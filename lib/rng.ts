export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function next() {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rand: () => number, xs: T[]): T {
  return xs[Math.floor(rand() * xs.length)];
}

export function between(rand: () => number, min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}