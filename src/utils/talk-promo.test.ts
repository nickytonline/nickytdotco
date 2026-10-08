import { describe, expect, it } from "vitest";
import { upcomingTalkPromoHtml } from "./talk-promo";

const upcomingTalk = {
  upcoming: true as const,
  date: new Date("2026-09-23T11:30:00-07:00"),
  endDate: new Date("2026-09-23T11:55:00-07:00"),
};

describe("upcomingTalkPromoHtml", () => {
  it("renders markdown for an upcoming talk with a promo", () => {
    const html = upcomingTalkPromoHtml(
      {
        ...upcomingTalk,
        promo:
          "Use code [**NICKTAYLOR50**](https://luma.com/sanjose26?coupon=NICKTAYLOR50) when you [register on Luma](https://luma.com/sanjose26?coupon=NICKTAYLOR50).",
      },
      Date.parse("2026-09-10T12:00:00.000Z")
    );

    expect(html).toContain("NICKTAYLOR50");
    expect(html).toContain(
      'href="https://luma.com/sanjose26?coupon=NICKTAYLOR50"'
    );
    expect(html).toContain("<strong>NICKTAYLOR50</strong>");
  });

  it("is undefined when promo is omitted", () => {
    expect(
      upcomingTalkPromoHtml(
        upcomingTalk,
        Date.parse("2026-09-10T12:00:00.000Z")
      )
    ).toBeUndefined();
  });

  it("is undefined when promo is blank", () => {
    expect(
      upcomingTalkPromoHtml(
        { ...upcomingTalk, promo: "   " },
        Date.parse("2026-09-10T12:00:00.000Z")
      )
    ).toBeUndefined();
  });

  it("hides the promo after the talk is no longer upcoming", () => {
    expect(
      upcomingTalkPromoHtml(
        {
          ...upcomingTalk,
          promo: "Tickets are 50% off with code **NICKTAYLOR50**.",
        },
        Date.parse("2026-09-23T19:00:00.000Z")
      )
    ).toBeUndefined();
  });
});
