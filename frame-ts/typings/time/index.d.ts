// frame/time.d.ts

/** @noSelf */
declare module "time" {

  /**
   * Sets or gets the current time.
   * @param timestamp - The UTC timestamp to set the internal real-time clock. If not provided, returns the current time.
   * @returns The current time if no timestamp is provided.
   */
  function utc(timestamp?: number): number;

  /**
   * Sets or gets the timezone offset.
   * @param offset - The timezone offset. If not provided, returns the current timezone.
   * @returns The current timezone if no offset is provided.
   */
  function zone(offset?: string): string;

  /**
   * Returns a table containing second, minute, hour, day, month, year, weekday, day of year, and is daylight saving.
   * @param timestamp - The optional timestamp to calculate the date for.
   * @returns A table with date components.
   */
  function date(timestamp?: number): {
    second: number,
    minute: number,
    hour: number,
    day: number,
    month: number,
    year: number,
    weekday: number,
    dayOfYear: number,
    isDST: boolean
  };
}