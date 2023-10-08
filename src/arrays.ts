import { List } from "@mantlebee/ts-core";

import { generateRandomNumber } from "./numbers";

/**
 * Extracts a random item from an array. The extracted item can be removed or not from the array.
 * @param items Items from which to extract a random one.
 * @param extractPhysically If true, the random item is removed from the list.
 * @returns a random item from a list.
 */
export function extractRandomItem<TItem>(
  items: List<TItem>,
  extractPhysically = false
): TItem {
  if (items.length === 1) return items[0];
  const index = generateRandomNumber(items.length - 1);
  if (extractPhysically) return items.splice(index, 1)[0];
  return items[index];
}

/**
 * Extracts a sub-list of items from an array. The length of the sub-list is random. The extracted items can be removed or not from the array.
 * @param items Items from which to extract a sub-list.
 * @param extractPhysically If true, the random picked items are removed from the list.
 * @returns a sub-list of the items array.
 */
export function extractRandomItems<TItem>(
  items: List<TItem>,
  extractPhysically = false
): List<TItem> {
  if (items.length === 1) {
    if (extractPhysically) return items.splice(0, 1);
    return items;
  }
  const randomCount = generateRandomNumber(items.length - 1);
  const randomItems: List<TItem> = [];
  for (let i = 0; i < randomCount; ++i)
    randomItems.push(extractRandomItem(items, extractPhysically));
  return randomItems;
}
