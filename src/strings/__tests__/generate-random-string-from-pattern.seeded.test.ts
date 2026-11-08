import { createSeededRandom } from "@/seed/create-seeded-random";
import { generateRandomStringFromPattern } from "../generate-random-string-from-pattern";

const generate = (seed: number) => {
  const random = createSeededRandom(seed);
  return Array.from({ length: 20 }, () =>
    generateRandomStringFromPattern("(IT)00A0{5}-mm-a{2,6}", { random }),
  );
};

describe("strings", () => {
  describe("generateRandomStringFromPattern with a seeded generator", () => {
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
