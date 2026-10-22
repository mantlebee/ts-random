import { TimeGrid, TimeRange } from "../time-grid";

const range = (from: number, to: number): TimeRange => ({
  from,
  to,
  count: to - from + 1,
});

// 10-12 h, 15-16 m, 30-32 s: 3 * 2 * 3 = 18 allowed times.
const grid = new TimeGrid(range(10, 12), range(15, 16), range(30, 32));

describe("dates", () => {
  describe("TimeGrid", () => {
    it("Counts the combinations of hours, minutes and seconds", () => {
      expect(grid.count).toBe(18);
      expect(new TimeGrid(range(0, 23), range(0, 59), range(0, 59)).count).toBe(
        86400,
      );
    });
    it("Returns the time of an index, sorted by time", () => {
      expect(grid.getTime(0)).toEqual([10, 15, 30]);
      expect(grid.getTime(1)).toEqual([10, 15, 31]);
      expect(grid.getTime(3)).toEqual([10, 16, 30]);
      expect(grid.getTime(4)).toEqual([10, 16, 31]);
      expect(grid.getTime(6)).toEqual([11, 15, 30]);
      expect(grid.getTime(17)).toEqual([12, 16, 32]);
    });
    it("Returns the index of an allowed time", () => {
      for (let i = 0; i < grid.count; ++i)
        expect(grid.getFirstIndexFrom(...grid.getTime(i))).toBe(i);
    });
    it("Returns the index of the first allowed time after a time that is not allowed", () => {
      // Before the first hour, minute or second.
      expect(grid.getFirstIndexFrom(9, 59, 59)).toBe(0);
      expect(grid.getFirstIndexFrom(11, 0, 0)).toBe(6);
      expect(grid.getFirstIndexFrom(11, 16, 0)).toBe(9);
      // After the last second or minute: the next minute or hour.
      expect(grid.getFirstIndexFrom(10, 15, 40)).toBe(3);
      expect(grid.getFirstIndexFrom(10, 20, 0)).toBe(6);
    });
    it("Returns count if no allowed time is at or after the given one", () => {
      expect(grid.getFirstIndexFrom(12, 16, 33)).toBe(18);
      expect(grid.getFirstIndexFrom(12, 17, 0)).toBe(18);
      expect(grid.getFirstIndexFrom(13, 0, 0)).toBe(18);
      expect(grid.getFirstIndexFrom(23, 59, 60)).toBe(18);
    });
  });
});
