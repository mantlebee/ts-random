import { List } from "@mantlebee/ts-core";

import { generateRandomDate } from "../dates";

const endDate = new Date(1990, 12, 31, 23, 59, 59);
const firstDate = new Date(1970, 0, 1, 0, 0, 0);
const startDate = new Date(1990, 0, 1, 0, 0, 0);

describe("common", () => {
  describe("utils", () => {
    describe("dates", () => {
      describe("generateRandomNDate", () => {
        it("Generates a random date between 1970/01/01 and now", () => {
          const randoms: List<Date> = [];
          for (let i = 0; i < 100; ++i) randoms.push(generateRandomDate());
          expect(
            randoms.every((a) => a.getTime() <= Date.now() && a >= firstDate)
          ).toBeTruthy();
        });
        it("Generates a random date between 1970/01/01 and the given end date", () => {
          const randoms: List<Date> = [];
          for (let i = 0; i < 100; ++i)
            randoms.push(generateRandomDate(endDate));
          expect(
            randoms.every((a) => a <= endDate && a >= firstDate)
          ).toBeTruthy();
        });
        it("Generates a random date in the given range", () => {
          const randoms: List<Date> = [];
          for (let i = 0; i < 100; ++i)
            randoms.push(generateRandomDate(endDate, startDate));
          expect(
            randoms.every((a) => a >= startDate && a <= endDate)
          ).toBeTruthy();
        });
        it("Generates the same date, with hours from 9 to 18", () => {
          const randoms: List<Date> = [];
          for (let i = 0; i < 100; ++i)
            randoms.push(
              generateRandomDate(endDate, endDate, {
                hoursFrom: 9,
                hoursTo: 18,
              })
            );
          expect(
            randoms.every(
              (a) => a == endDate && a.getHours() >= 9 && a.getHours() <= 18
            )
          ).toBeTruthy();
        });
        it("Generates a random date in the given range with hours set to 01:02:03", () => {
          const randoms: List<Date> = [];
          for (let i = 0; i < 100; ++i)
            randoms.push(
              generateRandomDate(endDate, startDate, {
                hoursFrom: 1,
                hoursTo: 1,
                minutesFrom: 2,
                minutesTo: 2,
                secondsFrom: 3,
                secondsTo: 3,
              })
            );
          expect(
            randoms.every(
              (a) =>
                a >= startDate &&
                a <= endDate &&
                a.getHours() === 1 &&
                a.getMinutes() === 2 &&
                a.getSeconds() === 3
            )
          ).toBeTruthy();
        });
      });
    });
  });
});
