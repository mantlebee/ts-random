import { List } from "@mantlebee/ts-core";

import { extractRandomItem } from "../arrays";

type Item = { id: number; name: string };

const items: List<Item> = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
];
const defaultItem: Item = { id: 3, name: "Jack" };

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
          expect(list.length).toBe(1);
          expect(list.find((a) => a === random)).toBeUndefined();
        });
      });
    });
  });
});
