import { List } from "@mantlebee/ts-core";

import { extractSecureRandomItem } from "../extract-secure-random-item";

type Item = { id: number; name: string };

const items: List<Item> = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Josh" },
  { id: 4, name: "Jasper" },
];
const defaultItem: Item = { id: 5, name: "Jack" };

describe("secure", () => {
  describe("utils", () => {
    describe("extractSecureRandomItem", () => {
      it("Extracts every item of a list, without modifying it", () => {
        const list = [...items];
        const randoms: List<Item> = [];
        for (let i = 0; i < 200; i++)
          randoms.push(extractSecureRandomItem(list));
        items.forEach((item) => {
          expect(randoms.some((a) => a === item)).toBeTruthy();
        });
        expect(list).toEqual(items);
      });
      it("If list has 1 items only, that one is extracted", () => {
        expect(extractSecureRandomItem([defaultItem])).toBe(defaultItem);
      });
      it("Throws a RangeError if the list is empty", () => {
        expect(() => extractSecureRandomItem([])).toThrow(RangeError);
      });
    });
  });
});
