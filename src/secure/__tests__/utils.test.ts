import { List, numberIsInteger } from "@mantlebee/ts-core";

import {
  extractSecureRandomItem,
  generateSecureRandomInteger,
  shuffleSecureRandomItems,
} from "../utils";

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
    describe("generateSecureRandomInteger", () => {
      it("Generates integers between 0 and the given max value, max excluded", () => {
        const max = 7;
        const randoms: List<number> = [];
        for (let i = 0; i < 1000; ++i)
          randoms.push(generateSecureRandomInteger(max));
        expect(randoms.every((a) => a >= 0 && a < max)).toBeTruthy();
        expect(randoms.every(numberIsInteger)).toBeTruthy();
        expect(new Set(randoms).size).toBe(max);
      });
      it("Always returns 0 if max is 1", () => {
        for (let i = 0; i < 100; ++i)
          expect(generateSecureRandomInteger(1)).toBe(0);
      });
      it("Accepts 2^32 as max value", () => {
        const random = generateSecureRandomInteger(2 ** 32);
        expect(random >= 0 && random < 2 ** 32).toBeTruthy();
      });
      it("Throws a RangeError if max is not an integer between 1 and 2^32", () => {
        [0, -1, 1.5, NaN, Infinity, 2 ** 32 + 1].forEach((a) => {
          expect(() => generateSecureRandomInteger(a)).toThrow(RangeError);
        });
      });
    });
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
    describe("shuffleSecureRandomItems", () => {
      it("Returns a permutation of the list, without modifying it", () => {
        const list = [...items];
        const shuffled = shuffleSecureRandomItems(list);
        expect(shuffled).not.toBe(list);
        expect(list).toEqual(items);
        expect(shuffled).toHaveLength(items.length);
        expect([...shuffled].sort((a, b) => a.id - b.id)).toEqual(items);
      });
      it("Returns different orders", () => {
        const orders = new Set<string>();
        for (let i = 0; i < 100; i++)
          orders.add(
            shuffleSecureRandomItems(items)
              .map((a) => a.id)
              .join(),
          );
        expect(orders.size).toBeGreaterThan(1);
      });
      it("Returns an empty list if the list is empty", () => {
        expect(shuffleSecureRandomItems([])).toEqual([]);
      });
    });
  });
});
