import { generateRandomNumber } from "@/numbers";

import { GenerateRandomDateOptions } from "./types";

/**
 * Generates a random date in the given range.
 * @param startDate Starting date range, default is the Javascript standard 1970/01/01, but it could be less than that.
 * @param endDate Ending date range, default is now.
 * @param options Extended options for random datetime generations.
 * @returns a random date in the given range.
 */
export function generateRandomDate(
  endDate = new Date(),
  startDate = new Date("1970-01-01"),
  options: GenerateRandomDateOptions = {}
) {
  // https://stackoverflow.com/questions/31378526/generate-random-date-between-two-dates-and-times-in-javascript
  const {
    hoursFrom = 0,
    hoursTo = 23,
    minutesFrom = 0,
    minutesTo = 59,
    secondsFrom = 0,
    secondsTo = 59,
  } = options;
  let date = endDate;
  if (endDate.getTime() != startDate.getTime())
    date = new Date(
      +startDate + Math.random() * (endDate.getTime() - startDate.getTime())
    );
  const hours = generateRandomNumber(hoursTo, hoursFrom);
  const minutes = generateRandomNumber(minutesTo, minutesFrom);
  const seconds = generateRandomNumber(secondsTo, secondsFrom);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
}
