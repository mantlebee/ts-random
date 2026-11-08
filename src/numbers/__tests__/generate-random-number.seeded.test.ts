import { createSeededRandom } from "@/seed/create-seeded-random";
import { generateRandomNumber } from "../generate-random-number";

const generate = (seed: number) => {
  const random = createSeededRandom(seed);
  return Array.from({ length: 20 }, () =>
    generateRandomNumber(100, 0, 2, { random }),
  );
};

describe("numbers", () => {
  describe("generateRandomNumber with a seeded generator", () => {
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
