interface DateData {
  day: number;
  dayOfYear: number;
  hour: number;
  isDaylightSaving: boolean;
  minute: number;
  month: number;
  second: number;
  weekday: number;
  year: number;
}

/**
 * The Time class allows for accurate timekeeping on Frame.
 * The utc() function can be used to set the time on Frame using a UTC timestamp.
 * Frame will then keep the time until it’s put back onto charge, or placed into deep sleep using frame.sleep().
 * The date() function can be used to return a human-readable time and date.
 */
export class Time {
  private currentTimestamp: number;
  private timezoneOffset: string;

  constructor() {
    this.currentTimestamp = Math.floor(Date.now() / 1000);
    this.timezoneOffset = "0:00";
  }

  /**
   * Returns an object containing the date and time components.
   * @param timestamp - The optional timestamp to calculate the corresponding date.
   * @returns An object with date and time components.
   */
  date(timestamp?: number): DateData {
    const date = timestamp
      ? new Date(timestamp * 1000)
      : new Date(this.currentTimestamp * 1000);
    const dateData: DateData = {
      day: date.getUTCDate(),
      dayOfYear: Math.floor(
        (date.getTime() - new Date(date.getUTCFullYear(), 0, 0).getTime()) /
          86400000,
      ),
      hour: date.getUTCHours(),
      isDaylightSaving: false, // JavaScript Date does not directly provide this information
      minute: date.getUTCMinutes(),
      month: date.getUTCMonth() + 1,
      second: date.getUTCSeconds(),
      weekday: date.getUTCDay(),
      year: date.getUTCFullYear(),
    };
    console.log(`Date data: ${JSON.stringify(dateData)}`);
    return dateData;
  }

  /**
   * Sets or gets the current time.
   * @param timestamp - The UTC timestamp to set the internal real-time clock.
   * @returns The current time as a UTC timestamp.
   */
  utc(timestamp?: number): number {
    if (timestamp !== undefined) {
      this.currentTimestamp = timestamp;
      console.log(`UTC time set to: ${timestamp}`);
    }
    return this.currentTimestamp;
  }

  /**
   * Sets or gets the timezone offset.
   * @param offset - The timezone offset to set. The format should be a string, e.g. '-7:00', or '5:30'.
   * @returns The currently set timezone offset.
   */
  zone(offset?: string): string {
    if (offset !== undefined) {
      this.timezoneOffset = offset;
      console.log(`Timezone offset set to: ${offset}`);
    }
    return this.timezoneOffset;
  }
}
