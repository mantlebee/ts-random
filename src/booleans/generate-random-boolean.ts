import { RandomOptions } from "@/seed/random-fn";

/**
 * Generates a random boolean value.
 * @param options `random`, the generator to use instead of `Math.random`.
 * @returns a random boolean value.
 */
export function generateRandomBoolean(options: RandomOptions = {}): boolean {
  const random = options.random ?? Math.random;
  return random() >= 0.5;
}
