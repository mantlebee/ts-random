import { List } from "@mantlebee/ts-core";

import { extractRandomItem } from "../extract-random-item";

type Item = { id: number; name: string };

const items: List<Item> = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Josh" },
  { id: 4, name: "Jasper" },
];
const defaultItem: Item = { id: 5, name: "Jack" };

describe("common", () => {
  describe("utils", () => {
    describe("arrays", () => {
      describe("extractRandomItem", () => {
        it("Extract a random item from a list", () => {
          const randoms: List<Item> = [];
          for (let i = 0; i < 100; i++) randoms.push(extractRandomItem(items));
          expect(randoms.some((a) => a === items[0])).toBeTruthy();
          expect(randoms.some((a) => a === items[1])).toBeTruthy();
        });
        it("If list has 1 items only, that one is extracted", () => {
          const randoms: List<Item> = [];
          for (let i = 0; i < 100; i++)
            randoms.push(extractRandomItem([defaultItem]));
          expect(randoms.every((a) => a === defaultItem)).toBeTruthy();
        });
        it("If extractPhysically is true, the extracted item will not be in the list anymore", () => {
          const list = [...items];
          const random = extractRandomItem(list, true);
          expect(list.find((a) => a === random)).toBeUndefined();
        });
        it("If extractPhysically is true and the list has 1 item only, the list becomes empty", () => {
          const list = [defaultItem];
          expect(extractRandomItem(list, true)).toBe(defaultItem);
          expect(list).toEqual([]);
        });
        it("Throws a RangeError if the list is empty", () => {
          expect(() => extractRandomItem([])).toThrow(
            new RangeError("extractRandomItem: empty list"),
          );
          expect(() => extractRandomItem([], true)).toThrow(
            new RangeError("extractRandomItem: empty list"),
          );
        });
      });
    });
  });
});
