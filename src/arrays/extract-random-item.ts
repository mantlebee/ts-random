import { List } from "@mantlebee/ts-core";

import { generateRandomNumber } from "@/numbers/generate-random-number";

/**
 * Extracts a random item from an array. The extracted item can be removed or not from the array.
 * @param items Items from which to extract a random one.
 * @param extractPhysically If true, the random item is removed from the list.
 * @returns a random item from a list.
 * @throws RangeError if the list is empty.
 */
export function extractRandomItem<TItem>(
  items: List<TItem>,
  extractPhysically = false,
): TItem {
  if (!items.length) throw new RangeError("extractRandomItem: empty list");
  const index = generateRandomNumber(items.length - 1);
  // The index is in range, so the item exists, even if it is `undefined`.
  if (extractPhysically) return items.splice(index, 1)[0] as TItem;
  return items[index] as TItem;
}
