import { List } from "@mantlebee/ts-core";

import { generateRandomNumber } from "./numbers";

/**
 * Extracts a random item from a list of items.
 * @param items Items from which to extract a random one.
 * @returns a random item from a list.
 */
export function extractRandomItem<TItem>(items: List<TItem>): TItem {
  if (items.length === 1) return items[0];
  const randomIndex = generateRandomNumber(items.length - 1);
  return items[randomIndex];
}
