import { List } from "@mantlebee/ts-core";

import { generateRandomNumber } from "@/numbers/generate-random-number";
import { RandomOptions } from "@/seed/random-fn";

import { extractRandomItem } from "./extract-random-item";

/**
 * Extracts a sub-list of items from an array. The length of the sub-list is random, from 0 to the length of the array, both included. The extracted items can be removed or not from the array.
 * @param items Items from which to extract a sub-list.
 * @param extractPhysically If true, the random picked items are removed from the list.
 * @param options `random`, the generator to use instead of `Math.random`.
 * @returns a new list with some items of the items array, each one at most once.
 */
export function extractRandomItems<TItem>(
  items: List<TItem>,
  extractPhysically = false,
  options: RandomOptions = {},
): List<TItem> {
  const random = options.random ?? Math.random;
  const randomCount = generateRandomNumber(items.length, 0, 0, { random });
  // Items are always removed from the source, so none is extracted twice.
  const source = extractPhysically ? items : [...items];
  const randomItems: List<TItem> = [];
  for (let i = 0; i < randomCount; ++i)
    randomItems.push(extractRandomItem(source, true, { random }));
  return randomItems;
}
