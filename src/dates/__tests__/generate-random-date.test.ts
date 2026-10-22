import { List } from "@mantlebee/ts-core";

import { generateRandomDate } from "../generate-random-date";

const firstDate = new Date(1970, 0, 1, 0, 0, 0);
const startDate = new Date(1990, 0, 1, 0, 0, 0);
const endDate = new Date(1990, 11, 31, 23, 59, 59);

const generateRandomDates = (
  count: number,
  ...args: Parameters<typeof generateRandomDate>
): List<Date> =>
  Array.from({ length: count }, () => generateRandomDate(...args));

const isBetween = (date: Date, start: Date, end: Date) =>
  date.getTime() >= start.getTime() && date.getTime() <= end.getTime();

describe("common", () => {
  describe("utils", () => {
    describe("dates", () => {
      describe("generateRandomDate", () => {
        it("Generates a random date between 1970/01/01 and now", () => {
          generateRandomDates(100).forEach((a) => {
            expect(isBetween(a, firstDate, new Date())).toBeTruthy();
          });
        });

        it("Generates a random date between 1970/01/01 and the given end date", () => {
          generateRandomDates(100, endDate).forEach((a) => {
            expect(isBetween(a, firstDate, endDate)).toBeTruthy();
          });
        });

        it("Generates a random date in the given range", () => {
          const randoms = generateRandomDates(100, endDate, startDate);
          randoms.forEach((a) => {
            expect(isBetween(a, startDate, endDate)).toBeTruthy();
          });
          expect(
            new Set(randoms.map((a) => a.getMonth())).size,
          ).toBeGreaterThan(1);
        });

        it("Stays in the range when it starts and ends during the day", () => {
          // Before, the time was set after picking the date: 9 dates out of 10
          // were out of this range.
          const start = new Date(2020, 0, 1, 8, 0, 0);
          const end = new Date(2020, 0, 1, 10, 0, 0);
          generateRandomDates(1000, end, start).forEach((a) => {
            expect(isBetween(a, start, end)).toBeTruthy();
          });
        });

        it("Stays in the range with time options, including partial first and last days", () => {
          const start = new Date(2020, 0, 1, 12, 30, 0);
          const end = new Date(2020, 0, 3, 10, 15, 0);
          const randoms = generateRandomDates(2000, end, start, {
            hoursFrom: 9,
            hoursTo: 17,
          });
          randoms.forEach((a) => {
            expect(isBetween(a, start, end)).toBeTruthy();
            expect(a.getHours() >= 9 && a.getHours() <= 17).toBeTruthy();
          });
          // Every day has allowed times: 12:30-17:59, 09:00-17:59, 09:00-10:15.
          expect(new Set(randoms.map((a) => a.getDate()))).toEqual(
            new Set([1, 2, 3]),
          );
        });

        it("Generates each allowed second with the same chance", () => {
          // 2 allowed seconds on the first day, 3 on the second one: a
          // partial day must not weigh as much as a complete one.
          const start = new Date(2020, 0, 1, 0, 0, 1);
          const end = new Date(2020, 0, 2, 23, 59, 59);
          const options = {
            hoursFrom: 0,
            hoursTo: 0,
            minutesTo: 0,
            secondsTo: 2,
          };
          const counts = new Map<number, number>();
          generateRandomDates(4000, end, start, options).forEach((a) => {
            counts.set(a.getTime(), (counts.get(a.getTime()) ?? 0) + 1);
          });
          expect(counts.size).toBe(5);
          counts.forEach((a) => {
            expect(a).toBeGreaterThan(800 * 0.8);
            expect(a).toBeLessThan(800 * 1.2);
          });
        });

        it("Generates dates of the same day, with hours from 9 to 18", () => {
          const start = new Date(1990, 11, 31, 0, 0, 0);
          generateRandomDates(100, endDate, start, {
            hoursFrom: 9,
            hoursTo: 18,
          }).forEach((a) => {
            expect(a.toDateString()).toBe(endDate.toDateString());
            expect(a.getHours() >= 9 && a.getHours() <= 18).toBeTruthy();
          });
        });

        it("Generates a random date in the given range with time set to 01:02:03.000", () => {
          generateRandomDates(100, endDate, startDate, {
            hoursFrom: 1,
            hoursTo: 1,
            minutesFrom: 2,
            minutesTo: 2,
            secondsFrom: 3,
            secondsTo: 3,
          }).forEach((a) => {
            expect(isBetween(a, startDate, endDate)).toBeTruthy();
            expect(a.getHours()).toBe(1);
            expect(a.getMinutes()).toBe(2);
            expect(a.getSeconds()).toBe(3);
            expect(a.getMilliseconds()).toBe(0);
          });
        });

        it("Generates dates without milliseconds", () => {
          generateRandomDates(100).forEach((a) => {
            expect(a.getMilliseconds()).toBe(0);
          });
        });

        it("Returns the date itself if start and end are the same and its time is allowed", () => {
          const date = new Date(2020, 5, 15, 10, 20, 30);
          expect(generateRandomDate(date, new Date(date)).getTime()).toBe(
            date.getTime(),
          );
        });

        it("Doesn't modify the given dates and returns a new instance", () => {
          const start = new Date(2020, 5, 15, 10, 20, 30);
          const end = new Date(start);
          const startTime = start.getTime();
          const random = generateRandomDate(end, start, { hoursFrom: 10 });
          expect(random).not.toBe(end);
          expect(random).not.toBe(start);
          expect(start.getTime()).toBe(startTime);
          expect(end.getTime()).toBe(startTime);
        });

        describe("Daylight saving time, in Europe/Rome", () => {
          const hour = 60 * 60 * 1000;

          it("Runs in Europe/Rome", () => {
            // Set by jest.global-setup.js: the other tests check nothing without it.
            expect(new Date(2026, 2, 29, 2, 30).getHours()).toBe(3);
          });

          it("Stays in the range when the clocks go forward", () => {
            // 2026-03-29 02:00 doesn't exist, the clocks go from 01:59:59 to
            // 03:00:00: the times from 02:00 to 02:59 were moved to 03:xx.
            const start = new Date(2026, 2, 29, 1, 59, 0);
            const end = new Date(2026, 2, 29, 3, 0, 30);
            const randoms = generateRandomDates(2000, end, start);
            randoms.forEach((a) => {
              expect(isBetween(a, start, end)).toBeTruthy();
            });
            // 60 seconds before the change, 31 after it.
            expect(new Set(randoms.map((a) => a.getTime())).size).toBe(91);
          });

          it("Stays in the range when it starts in the repeated hour", () => {
            // 2026-10-25 02:00-02:59 happens twice, at +02:00 and at +01:00.
            // The range starts at the second 02:30: the first one is before it.
            const start = new Date(
              new Date(2026, 9, 25, 2, 30).getTime() + hour,
            );
            const end = new Date(2026, 9, 25, 3, 10, 0);
            generateRandomDates(2000, end, start).forEach((a) => {
              expect(isBetween(a, start, end)).toBeTruthy();
            });
          });

          it("Generates only times that exist", () => {
            // Hours 02:xx are allowed, but they don't exist on 2026-03-29.
            const start = new Date(2026, 2, 28, 0, 0, 0);
            const end = new Date(2026, 2, 30, 23, 59, 59);
            const randoms = generateRandomDates(2000, end, start, {
              hoursFrom: 2,
              hoursTo: 2,
            });
            randoms.forEach((a) => {
              expect(a.getHours()).toBe(2);
            });
            expect(new Set(randoms.map((a) => a.getDate()))).toEqual(
              new Set([28, 30]),
            );
          });

          it("Throws a RangeError if all the allowed times are skipped", () => {
            const start = new Date(2026, 2, 29, 0, 0, 0);
            const end = new Date(2026, 2, 29, 23, 59, 59);
            expect(() =>
              generateRandomDate(end, start, { hoursFrom: 2, hoursTo: 2 }),
            ).toThrow(RangeError);
          });
        });

        it("Throws a RangeError if the start date is after the end date", () => {
          expect(() => generateRandomDate(startDate, endDate)).toThrow(
            RangeError,
          );
        });

        it("Throws a RangeError if a date is invalid", () => {
          expect(() => generateRandomDate(new Date(NaN))).toThrow(RangeError);
          expect(() => generateRandomDate(endDate, new Date(NaN))).toThrow(
            RangeError,
          );
        });

        it("Throws a RangeError if an option is out of its range or inverted", () => {
          [
            { hoursTo: 24 },
            { hoursFrom: -1 },
            { minutesTo: 60 },
            { secondsTo: 60 },
            { secondsFrom: 1.5 },
            { hoursFrom: 18, hoursTo: 9 },
          ].forEach((a) => {
            expect(() => generateRandomDate(endDate, startDate, a)).toThrow(
              RangeError,
            );
          });
        });

        it("Throws a RangeError if no date in the range has an allowed time", () => {
          const start = new Date(2020, 0, 1, 10, 0, 0);
          const end = new Date(2020, 0, 1, 12, 0, 0);
          expect(() =>
            generateRandomDate(end, start, { hoursFrom: 13, hoursTo: 14 }),
          ).toThrow(RangeError);
        });
      });
    });
  });
});
