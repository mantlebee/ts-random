import { List } from "@mantlebee/ts-core";

import { generateRandomNumber } from "./numbers";

/**
 * Extracts a random item from a list of items. The extracted item can be removed by the array.
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
 * Extracts a sub-list of random count a list of items. The extracted items can be removed by the array.
 * @param items Items from which to extract a sub-list.
 * @param extractPhysically If true, the random items are removed from the list.
 * @returns a sub-list of random items.
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
