import { DateTime } from "luxon";

/**
 * Appends the appropriate ordinal suffix to a number (e.g., 1st, 2nd, 3rd, 4th).
 * Stolen from https://stackoverflow.com/a/31615643
 *
 * @param n - The number to append a suffix to
 * @returns The number with its ordinal suffix
 */
function appendSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Formats a date into a human-readable string with ordinal suffix.
 * Example: "1st January 2024"
 *
 * @param value - The date value to format (string, Date, or number)
 * @returns Formatted date string with ordinal day, month name, and year
 */
export function dateFilter(value: string | Date | number): string {
  const dateObject = new Date(value);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayWithSuffix = appendSuffix(dateObject.getDate());

  return `${dayWithSuffix} ${months[dateObject.getMonth()]} ${dateObject.getFullYear()}`;
}

/**
 * Formats a date into W3C/ISO 8601 format.
 * Example: "2024-01-01T00:00:00.000Z"
 *
 * @param value - The date value to format (string, Date, or number)
 * @returns ISO 8601 formatted date string
 */
export function w3DateFilter(value: string | Date | number): string {
  const dateObject = new Date(value);
  return dateObject.toISOString();
}

/**
 * Formats a date into an HTML-compatible date string (yyyy-MM-dd).
 * Example: "2024-01-01"
 *
 * @param dateObj - The date object to format
 * @returns Date string in yyyy-MM-dd format
 */
export function htmlDateString(dateObj: Date): string {
  return DateTime.fromJSDate(dateObj).toFormat("yyyy-LL-dd");
}

/**
 * Truncates a string to a specified length and adds ellipsis if truncated.
 *
 * @param str - The string to truncate
 * @param length - Maximum length before truncation (default: 100)
 * @returns Truncated string with ellipsis if needed, or original string
 */
export function truncate(
  str: string | null | undefined,
  length: number = 100
): string {
  if (!str || str.length <= length) return str || "";
  return str.substring(0, length) + "...";
}

/**
 * Finds the index of an item in an array by matching its URL property.
 *
 * @param array - Array of objects with url properties
 * @param url - The URL to search for
 * @returns Index of the matching item, or -1 if not found
 */
export function findIndex(array: Array<{ url: string }>, url: string): number {
  return array.findIndex((item) => item.url === url);
}

/**
 * Represents a series object with various possible structures
 */
type Series =
  | string
  | { collection_id?: number | string; name?: string }
  | { name?: string };

/**
 * Interface for a post object
 */
interface Post {
  data: {
    series?: Series;
  };
  [key: string]: unknown;
}

/**
 * Filters a collection of posts by series.
 * Handles both string-based series and object-based series with collection_id or name.
 *
 * @param collection - Array of posts to filter
 * @param series - The series identifier (string, object with collection_id, or object with name)
 * @returns Filtered array of posts belonging to the specified series
 */
export function seriesFilter(
  collection: Post[],
  series: Series | null | undefined
): Post[] {
  if (!series) return [];

  // Normalize series identifier
  const seriesId =
    typeof series === "string"
      ? series
      : "collection_id" in series && series.collection_id
        ? String(series.collection_id)
        : series.name;

  return collection.filter((post) => {
    const postSeries = post.data.series;
    if (!postSeries) return false;

    const postSeriesId =
      typeof postSeries === "string"
        ? postSeries
        : "collection_id" in postSeries && postSeries.collection_id
          ? String(postSeries.collection_id)
          : postSeries.name;

    return postSeriesId === seriesId;
  });
}

/**
 * Extracts the name from a series object or returns the series string directly.
 *
 * @param series - The series identifier (string or object with name property)
 * @returns The series name as a string, or empty string if not found
 */
export function seriesName(series: Series | null | undefined): string {
  if (!series) return "";
  return typeof series === "string" ? series : series.name || "";
}
