import { createSeededRandom } from "../create-seeded-random";

const take = (random: () => number, count: number) =>
  Array.from({ length: count }, () => random());

describe("seed", () => {
  describe("createSeededRandom", () => {
    it("Generates the mulberry32 sequence of seed 42", () => {
      // Protects the sequence: changing it changes the data of every consumer.
      expect(take(createSeededRandom(42), 5)).toEqual([
        0.6011037519201636, 0.44829055899754167, 0.8524657934904099,
        0.6697340414393693, 0.17481389874592423,
      ]);
    });
    it("Generates the same sequence for the same seed", () => {
      expect(take(createSeededRandom(7), 100)).toEqual(
        take(createSeededRandom(7), 100),
      );
    });
    it("Generates different sequences for different seeds", () => {
      expect(take(createSeededRandom(1), 10)).not.toEqual(
        take(createSeededRandom(2), 10),
      );
    });
    it("Generates numbers in [0, 1)", () => {
      const randoms = take(createSeededRandom(123), 10_000);
      expect(randoms.every((a) => a >= 0 && a < 1)).toBeTruthy();
      expect(randoms.some((a) => a < 0.1)).toBeTruthy();
      expect(randoms.some((a) => a > 0.9)).toBeTruthy();
    });
    it("Accepts 0, negative seeds and seeds above 2^32", () => {
      expect(take(createSeededRandom(0), 3)).toHaveLength(3);
      expect(take(createSeededRandom(-1), 5)).toEqual(
        take(createSeededRandom(2 ** 32 - 1), 5),
      );
      expect(take(createSeededRandom(2 ** 32 + 42), 5)).toEqual(
        take(createSeededRandom(42), 5),
      );
    });
    it("Throws a RangeError if the seed is not an integer", () => {
      for (const seed of [1.5, NaN, Infinity])
        expect(() => createSeededRandom(seed)).toThrow(RangeError);
    });
    it("Doesn't use Math.random", () => {
      const spy = jest.spyOn(Math, "random");
      take(createSeededRandom(42), 10);
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
