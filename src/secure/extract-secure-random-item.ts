import { List } from "@mantlebee/ts-core";

import { generateSecureRandomInteger } from "./generate-secure-random-integer";

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
  // The index is in range, so the item exists, even if it is `undefined`.
  return items[generateSecureRandomInteger(items.length)] as TItem;
}
