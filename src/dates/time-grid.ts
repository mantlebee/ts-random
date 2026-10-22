/**
 * Range of a time component (hours, minutes or seconds), both included.
 */
export type TimeRange = { from: number; to: number; count: number };

/**
 * The allowed times of a day are the combinations of the allowed hours,
 * minutes and seconds. Sorted by time, they can be addressed by an index, as
 * the digits of a number with mixed bases: `index = h * nM * nS + m * nS + s`.
 */
export class TimeGrid {
  public readonly count: number;
  private readonly hours: TimeRange;
  private readonly minutes: TimeRange;
  private readonly seconds: TimeRange;

  public constructor(hours: TimeRange, minutes: TimeRange, seconds: TimeRange) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.count = hours.count * minutes.count * seconds.count;
  }

  /**
   * @returns the index of the first allowed time at or after the given one,
   * {@link count} if there is none.
   */
  public getFirstIndexFrom(
    hours: number,
    minutes: number,
    seconds: number,
  ): number {
    const { hours: h, minutes: m, seconds: s } = this;
    const perHour = m.count * s.count;
    if (hours < h.from) return 0;
    if (hours > h.to) return this.count;
    const hourIndex = (hours - h.from) * perHour;
    if (minutes < m.from) return hourIndex;
    if (minutes > m.to) return hourIndex + perHour;
    const minuteIndex = hourIndex + (minutes - m.from) * s.count;
    if (seconds < s.from) return minuteIndex;
    if (seconds > s.to) return minuteIndex + s.count;
    return minuteIndex + seconds - s.from;
  }

  /**
   * @returns hours, minutes and seconds of the allowed time with the given index.
   */
  public getTime(index: number): [number, number, number] {
    const { hours: h, minutes: m, seconds: s } = this;
    const seconds = index % s.count;
    const minutes = Math.floor(index / s.count) % m.count;
    const hours = Math.floor(index / (s.count * m.count));
    return [h.from + hours, m.from + minutes, s.from + seconds];
  }
}
