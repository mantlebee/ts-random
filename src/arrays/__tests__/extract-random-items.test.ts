import { List } from "@mantlebee/ts-core";

import { extractRandomItems } from "../extract-random-items";

type Item = { id: number; name: string };

const items: List<Item> = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Josh" },
  { id: 4, name: "Jasper" },
];
const defaultItem: Item = { id: 5, name: "Jack" };

describe("arrays", () => {
  describe("extractRandomItems", () => {
    it("Extract a random sub-list from a list", () => {
      const randoms: List<List<Item>> = [];
      for (let i = 0; i < 100; i++) randoms.push(extractRandomItems(items));
      expect(randoms.some((a) => a.length < items.length)).toBeTruthy();
    });
    it("Extracts from 0 to all the items", () => {
      const lengths = new Set<number>();
      for (let i = 0; i < 200; i++)
        lengths.add(extractRandomItems(items).length);
      expect(lengths).toEqual(new Set([0, 1, 2, 3, 4]));
    });
    it("If list has 1 items only, an empty list or the item is returned", () => {
      const randoms: List<List<Item>> = [];
      for (let i = 0; i < 100; i++)
        randoms.push(extractRandomItems([defaultItem]));
      randoms.forEach((a) => {
        expect([[], [defaultItem]]).toContainEqual(a);
      });
      expect(randoms.some((a) => a.length === 0)).toBeTruthy();
      expect(randoms.some((a) => a.length === 1)).toBeTruthy();
    });
    it("Doesn't extract the same item twice", () => {
      for (let i = 0; i < 100; i++) {
        const randoms = extractRandomItems(items);
        expect(new Set(randoms).size).toBe(randoms.length);
      }
      expect(items).toHaveLength(4);
    });
    it("If the list is empty, an empty list is returned", () => {
      expect(extractRandomItems([])).toEqual([]);
      expect(extractRandomItems([], true)).toEqual([]);
    });
    it("Returns a new list, not the given one", () => {
      const list = [defaultItem];
      expect(extractRandomItems(list)).not.toBe(list);
    });
    it("If extractPhysically is true, the extracted items will not be in the list anymore", () => {
      const list = [...items];
      const randoms = extractRandomItems(list, true);
      randoms.forEach((random) => {
        expect(list.find((a) => a === random)).toBeUndefined();
      });
    });
  });
});
