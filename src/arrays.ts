import { List } from "@mantlebee/ts-core";

import { generateRandomNumber } from "./numbers";

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
  if (extractPhysically) return items.splice(index, 1)[0];
  return items[index];
}

/**
 * Extracts a sub-list of items from an array. The length of the sub-list is random, from 0 to the length of the array, both included. The extracted items can be removed or not from the array.
 * @param items Items from which to extract a sub-list.
 * @param extractPhysically If true, the random picked items are removed from the list.
 * @returns a new list with some items of the items array, each one at most once.
 */
export function extractRandomItems<TItem>(
  items: List<TItem>,
  extractPhysically = false,
): List<TItem> {
  const randomCount = generateRandomNumber(items.length);
  // Items are always removed from the source, so none is extracted twice.
  const source = extractPhysically ? items : [...items];
  const randomItems: List<TItem> = [];
  for (let i = 0; i < randomCount; ++i)
    randomItems.push(extractRandomItem(source, true));
  return randomItems;
}
