import { List } from "@mantlebee/ts-core";

/**
 * Generates a cryptographically secure random integer between 0 (included) and
 * `maxExclusive` (excluded).
 * Uses Web Crypto (`globalThis.crypto.getRandomValues`, available in browsers
 * and in Node.js 19+) with rejection sampling, so the result has no modulo bias.
 *
 * Unlike {@link generateRandomNumber}, the max value is **excluded**, so the
 * result can be used directly as an index of a list of `maxExclusive` items.
 * @example
 * Picks a random index of a 10 items list.
 * ```ts
 * generateSecureRandomInteger(10)
 * // eg. 7
 * ```
 * @param maxExclusive Upper bound, excluded. Must be an integer between 1 and 2^32.
 * @returns a random integer in `[0, maxExclusive)`.
 * @throws RangeError if `maxExclusive` is not an integer between 1 and 2^32.
 */
export function generateSecureRandomInteger(maxExclusive: number): number {
  if (
    !Number.isInteger(maxExclusive) ||
    maxExclusive < 1 ||
    maxExclusive > 2 ** 32
  )
    throw new RangeError(
      `generateSecureRandomInteger: invalid maxExclusive ${maxExclusive}`,
    );
  // Largest multiple of maxExclusive within 2^32: values above it are rejected,
  // otherwise the lowest results would come out more often.
  const limit = 2 ** 32 - (2 ** 32 % maxExclusive);
  const buffer = new Uint32Array(1);
  do globalThis.crypto.getRandomValues(buffer);
  while (buffer[0] >= limit);
  return buffer[0] % maxExclusive;
}

/**
 * Extracts a random item from an array using a cryptographically secure random
 * generator (see {@link generateSecureRandomInteger}). The array is not modified.
 * @example
 * ```ts
 * extractSecureRandomItem(["a", "b", "c"])
 * // eg. "b"
 * ```
 * @param items Items from which to extract a random one.
 * @returns a random item from the list.
 * @throws RangeError if the list is empty.
 */
export function extractSecureRandomItem<TItem>(items: List<TItem>): TItem {
  return items[generateSecureRandomInteger(items.length)];
}

/**
 * Shuffles an array with the Fisher-Yates algorithm and a cryptographically
 * secure random generator (see {@link generateSecureRandomInteger}).
 * The original array is not modified.
 * @example
 * ```ts
 * shuffleSecureRandomItems([1, 2, 3, 4])
 * // eg. [3, 1, 4, 2]
 * ```
 * @param items Items to shuffle.
 * @returns a shuffled copy of the list.
 */
export function shuffleSecureRandomItems<TItem>(
  items: List<TItem>,
): List<TItem> {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = generateSecureRandomInteger(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
