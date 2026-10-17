/** Canonical public origin. Branch subdomains are not this. */
export const PRODUCTION_SITE_URL = "https://www.nickyt.co";

export interface EmDashSiteUrlInput {
  /** Netlify `URL`: the site's primary address. */
  url?: string;
  /** Netlify `DEPLOY_PRIME_URL`: the deploy-preview or branch-deploy host. */
  deployPrimeUrl?: string;
  /** Netlify `CONTEXT`: `production`, `deploy-preview`, `branch-deploy`, or `dev`. */
  context?: string;
}

/**
 * Origin EmDash uses for admin login redirects and other absolute links.
 *
 * Netlify sets `DEPLOY_PRIME_URL` on every deploy. With branch deploys
 * enabled, a production build's value is the production-branch subdomain
 * (`https://main--<site>.netlify.app`), not the custom domain. Preferring
 * that value sends `/admin` and `/_emdash/admin` to the branch host.
 * Production uses the custom domain. Deploy previews and other branch
 * deploys keep the host of the deploy that was opened.
 */
export function resolveEmDashSiteUrl(input: EmDashSiteUrlInput): string {
  if (usesDeployHost(input.context)) {
    const deployHost = originOf(input.deployPrimeUrl) ?? originOf(input.url);
    if (deployHost && !isProductionBranchHost(deployHost)) {
      return deployHost;
    }
  }

  const primary = originOf(input.url);
  if (primary && !isNetlifyHost(primary)) {
    return primary;
  }

  return PRODUCTION_SITE_URL;
}

function usesDeployHost(context: string | undefined): boolean {
  return context === "deploy-preview" || context === "branch-deploy";
}

function originOf(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function isNetlifyHost(origin: string): boolean {
  return new URL(origin).hostname.endsWith(".netlify.app");
}

function isProductionBranchHost(origin: string): boolean {
  return /^main--.+\.netlify\.app$/i.test(new URL(origin).hostname);
}
