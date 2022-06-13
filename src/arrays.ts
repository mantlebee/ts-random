import { List } from "@mantlebee/ts-core";

import { generateRandomNumber } from "./numbers";

/**
 * Extracts a random item from a list of items. The extracted item can be removed by the array.
 * @param items Items from which to extract a random one.
 * @param extractPhysically If remove physically the random item from the list.
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
