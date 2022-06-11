import { Color, IColor, List } from "@mantlebee/ts-core";

import { generateRandomColor } from "../colors";

describe("common", () => {
  describe("utils", () => {
    describe("colors", () => {
      describe("generateRandomColor", () => {
        it("Generates a random color", () => {
          const randoms: List<IColor> = [];
          for (let i = 0; i < 100; ++i) randoms.push(generateRandomColor());
          randoms.forEach((a) => {
            expect(a.alpha === 1).toBeTruthy();
            expect(a.red >= 0 && a.red <= 255).toBeTruthy();
            expect(a.green >= 0 && a.green <= 255).toBeTruthy();
            expect(a.blue >= 0 && a.blue <= 255).toBeTruthy();
          });
        });
        it("Generates a random color with transparency", () => {
          const randoms: List<IColor> = [];
          for (let i = 0; i < 100; ++i) randoms.push(generateRandomColor(true));
          randoms.forEach((a) => {
            expect(a.alpha >= 0 && a.alpha <= 1).toBeTruthy();
          });
        });
        it("Generates a random color with rgb values between the given range", () => {
          const randoms: List<IColor> = [];
          const darkColor = new Color(100, 90, 80);
          const lightColor = new Color(200, 190, 180);
          for (let i = 0; i < 100; ++i)
            randoms.push(generateRandomColor(false, darkColor, lightColor));
          randoms.forEach((a) => {
            expect(
              a.red >= darkColor.red && a.red <= lightColor.red
            ).toBeTruthy();
            expect(
              a.green >= darkColor.green && a.green <= lightColor.green
            ).toBeTruthy();
            expect(
              a.blue >= darkColor.blue && a.blue <= lightColor.blue
            ).toBeTruthy();
          });
        });
      });
    });
  });
});
