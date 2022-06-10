import { List } from "@mantlebee/ts-core";

import { generateRandomBoolean } from "../booleans";

describe("common", () => {
  describe("utils", () => {
    describe("booleans", () => {
      describe("generateRandomBoolean", () => {
        it("Generates a random boolean", () => {
          const randoms: List<boolean> = [];
          for (let i = 0; i < 100; ++i) randoms.push(generateRandomBoolean());
          expect(randoms.some((a) => a)).toBeTruthy();
          expect(randoms.some((a) => !a)).toBeTruthy();
        });
      });
    });
  });
});
