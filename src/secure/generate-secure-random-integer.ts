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
  let value: number;
  // The buffer has 1 item, so the one at index 0 always exists.
  do value = globalThis.crypto.getRandomValues(buffer)[0] as number;
  while (value >= limit);
  return value % maxExclusive;
}
