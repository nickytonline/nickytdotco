export default async function searchRateLimit(
  _request: Request,
  context: { next: () => Promise<Response> }
) {
  return context.next();
}

// 20 requests / IP / minute for /api/search. Keep in sync with
// SEARCH_RATE_LIMIT_* in src/lib/search/constants.ts.
export const config = {
  path: "/api/search",
  rateLimit: {
    windowLimit: 20,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
