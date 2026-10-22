import { List } from "@mantlebee/ts-core";

import { generateSecureRandomInteger } from "./generate-secure-random-integer";

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
    // Both indexes are in range, so the items exist.
    [result[i], result[j]] = [result[j], result[i]] as [TItem, TItem];
  }
  return result;
}
