import { timingSafeEqual } from "node:crypto";

/** True when the request carries the schedule shared secret. */
export function isAuthorizedScheduleRequest(
  request: Request,
  secret: string | undefined
): boolean {
  if (!secret) return false;
  const header = request.headers.get("authorization") ?? "";
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(header);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
