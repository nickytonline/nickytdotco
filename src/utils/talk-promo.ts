import { isTalkUpcoming } from "./cdn-cache";
import { markdownFilter } from "./markdown";

type TalkPromoFields = {
  promo?: string;
  upcoming?: boolean;
  date: Date;
  endDate?: Date;
};

/**
 * Markdown promo HTML for a talk page, only while the talk is still upcoming.
 * Missing, blank, or expired promos return undefined so the callout stays hidden.
 */
export function upcomingTalkPromoHtml(
  talk: TalkPromoFields,
  nowMs: number = Date.now()
): string | undefined {
  const promo = talk.promo?.trim();
  if (!promo || !isTalkUpcoming(talk, nowMs)) {
    return undefined;
  }

  return markdownFilter(promo);
}
