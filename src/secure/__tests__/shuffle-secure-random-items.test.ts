import { List } from "@mantlebee/ts-core";

import { shuffleSecureRandomItems } from "../shuffle-secure-random-items";

type Item = { id: number; name: string };

const items: List<Item> = [
  { id: 1, name: "John" },
  { id: 2, name: "Jane" },
  { id: 3, name: "Josh" },
  { id: 4, name: "Jasper" },
];

describe("secure", () => {
  describe("utils", () => {
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
