import { describe, expect, it } from "vitest";
import { PRODUCTION_SITE_URL, resolveEmDashSiteUrl } from "./site-url.ts";

const BRANCH_HOST = "https://main--www-nickyt-co.netlify.app";
const PREVIEW_HOST = "https://deploy-preview-42--www-nickyt-co.netlify.app";
const FEATURE_BRANCH_HOST = "https://feature--www-nickyt-co.netlify.app";

describe("resolveEmDashSiteUrl", () => {
  it("uses the custom domain in production when the branch subdomain is also set", () => {
    expect(
      resolveEmDashSiteUrl({
        url: PRODUCTION_SITE_URL,
        deployPrimeUrl: BRANCH_HOST,
        context: "production",
      })
    ).toBe(PRODUCTION_SITE_URL);
  });

  it("uses the custom domain when production only has the branch subdomain", () => {
    expect(
      resolveEmDashSiteUrl({
        url: BRANCH_HOST,
        deployPrimeUrl: BRANCH_HOST,
        context: "production",
      })
    ).toBe(PRODUCTION_SITE_URL);
  });

  it("ignores the branch subdomain when the deploy context is unset", () => {
    expect(
      resolveEmDashSiteUrl({
        url: `${PRODUCTION_SITE_URL}/`,
        deployPrimeUrl: `${BRANCH_HOST}/_emdash/admin`,
      })
    ).toBe(PRODUCTION_SITE_URL);
  });

  it("keeps a deploy preview on that preview", () => {
    expect(
      resolveEmDashSiteUrl({
        url: PRODUCTION_SITE_URL,
        deployPrimeUrl: PREVIEW_HOST,
        context: "deploy-preview",
      })
    ).toBe(PREVIEW_HOST);
  });

  it("keeps a non-production branch deploy on that branch", () => {
    expect(
      resolveEmDashSiteUrl({
        url: PRODUCTION_SITE_URL,
        deployPrimeUrl: FEATURE_BRANCH_HOST,
        context: "branch-deploy",
      })
    ).toBe(FEATURE_BRANCH_HOST);
  });

  it("sends the production branch deploy to the custom domain", () => {
    expect(
      resolveEmDashSiteUrl({
        url: BRANCH_HOST,
        deployPrimeUrl: BRANCH_HOST,
        context: "branch-deploy",
      })
    ).toBe(PRODUCTION_SITE_URL);
  });

  it("keeps a local origin", () => {
    expect(
      resolveEmDashSiteUrl({
        url: "http://localhost:4321",
        context: "dev",
      })
    ).toBe("http://localhost:4321");
  });

  it("falls back to the custom domain when no usable URL is set", () => {
    expect(resolveEmDashSiteUrl({})).toBe(PRODUCTION_SITE_URL);
    expect(
      resolveEmDashSiteUrl({
        url: "not a url",
        deployPrimeUrl: BRANCH_HOST,
        context: "production",
      })
    ).toBe(PRODUCTION_SITE_URL);
  });
});
