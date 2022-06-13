import { List } from "@mantlebee/ts-core";

import { extractRandomItem, extractRandomItems } from "../arrays";

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
      });
      describe("extractRandomItems", () => {
        it("Extract a random sub-list from a list", () => {
          const randoms: List<List<Item>> = [];
          for (let i = 0; i < 100; i++) randoms.push(extractRandomItems(items));
          expect(randoms.some((a) => a.length < items.length)).toBeTruthy();
        });
        it("If list has 1 items only, the same list is returned", () => {
          const randoms: List<List<Item>> = [];
          for (let i = 0; i < 100; i++)
            randoms.push(extractRandomItems([defaultItem]));
          randoms.forEach((a) => {
            expect(a).toEqual([defaultItem]);
          });
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
  });
});
