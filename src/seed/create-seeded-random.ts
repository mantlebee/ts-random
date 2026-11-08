import { RandomFn } from "./random-fn";

/**
 * Creates a random generator that returns the same sequence of numbers for
 * the same seed, on every JavaScript engine. Like `Math.random`, each call
 * returns a number in [0, 1).
 * It uses mulberry32, a small and fast generator with a 32-bit state: good
 * for test data, not for secrets.
 * @example
 * Generates the same 3 numbers at every run.
 * ```ts
 * const random = createSeededRandom(42);
 * [random(), random(), random()];
 * ```
 * @example
 * Generates the same number between 1 and 10 at every run.
 * ```ts
 * generateRandomNumber(10, 1, 0, { random: createSeededRandom(42) });
 * ```
 * @param seed Integer seed. Seeds that differ by a multiple of 2^32, such as
 * -1 and 4294967295, generate the same sequence.
 * @returns a random generator to use instead of `Math.random`.
 * @throws RangeError if `seed` is not an integer.
 */
export function createSeededRandom(seed: number): RandomFn {
  if (!Number.isInteger(seed))
    throw new RangeError(`createSeededRandom: invalid seed ${seed}`);
  // Only 32-bit integer operations, so every engine gets the same results.
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
