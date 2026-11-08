import { createSeededRandom } from "@/seed/create-seeded-random";
import { extractRandomItem } from "../extract-random-item";

const generate = (seed: number) => {
  const random = createSeededRandom(seed);
  return Array.from({ length: 20 }, () =>
    extractRandomItem([1, 2, 3, 4, 5, 6, 7, 8], false, { random }),
  );
};

describe("arrays", () => {
  describe("extractRandomItem with a seeded generator", () => {
    it("Generates the same values for the same seed", () => {
      expect(generate(42)).toEqual(generate(42));
    });
    it("Generates different values for different seeds", () => {
      expect(generate(1)).not.toEqual(generate(2));
    });
    it("Doesn't use Math.random", () => {
      const spy = jest.spyOn(Math, "random");
      generate(42);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
