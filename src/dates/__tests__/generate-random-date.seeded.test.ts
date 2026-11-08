import { createSeededRandom } from "@/seed/create-seeded-random";
import { generateRandomDate } from "../generate-random-date";

const generate = (seed: number) => {
  const random = createSeededRandom(seed);
  return Array.from({ length: 20 }, () =>
    generateRandomDate(
      new Date(2024, 11, 31, 23, 59, 59),
      new Date(2024, 0, 1),
      {
        hoursFrom: 9,
        hoursTo: 17,
        random,
      },
    ).getTime(),
  );
};

describe("dates", () => {
  describe("generateRandomDate with a seeded generator", () => {
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
