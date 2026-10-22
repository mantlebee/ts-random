import { List } from "@mantlebee/ts-core";

import { generateRandomNumber } from "@/numbers/generate-random-number";

import { extractRandomItem } from "./extract-random-item";

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
