/**
 * YouTube Description Parser
 * Extracts guest information from YouTube video descriptions
 */

export interface GuestSocialLinks {
  website?: string;
  twitter?: string;
  github?: string;
  youtube?: string;
  linkedin?: string;
  bluesky?: string;
  twitch?: string;
}

export interface ParsedGuest {
  name: string;
  social: GuestSocialLinks;
}

/**
 * Extract guest name from YouTube description
 * @param description - The YouTube video description
 * @param hostName - The host name to exclude (default: "Nick Taylor")
 * @returns The guest's name or null if not found
 */
export function extractGuestName(
  description: string,
  hostName: string = "Nick Taylor"
): string | null {
  if (!description || description.trim().length === 0) {
    return null;
  }

  // Common patterns:
  // "Guest Name, Title at Company, joins Nick Taylor..."
  // "Guest Name joins Nick Taylor..."
  // "Guest Name, Title, joins Host to discuss..."

  // Extract first sentence/paragraph
  const firstParagraph = description.split("\n")[0].trim();

  // Pattern 1: "Name, [Title,] joins Host"
  const joinsPattern = /^([^,]+)(?:,\s+[^,]+)?,\s+joins\s+/i;
  const joinsMatch = firstParagraph.match(joinsPattern);

  if (joinsMatch) {
    const name = joinsMatch[1].trim();
    if (name && !name.toLowerCase().includes(hostName.toLowerCase())) {
      return name;
    }
  }

  // Pattern 2: "Name joins Host"
  const simpleJoinsPattern = /^([^,]+)\s+joins\s+/i;
  const simpleJoinsMatch = firstParagraph.match(simpleJoinsPattern);

  if (simpleJoinsMatch) {
    const name = simpleJoinsMatch[1].trim();
    if (name && !name.toLowerCase().includes(hostName.toLowerCase())) {
      return name;
    }
  }

  // Pattern 3: First name before comma (if not host)
  const firstNamePattern = /^([^,]+),/;
  const firstNameMatch = firstParagraph.match(firstNamePattern);

  if (firstNameMatch) {
    const name = firstNameMatch[1].trim();
    if (
      name &&
      !name.toLowerCase().includes(hostName.toLowerCase()) &&
      name.split(" ").length >= 2
    ) {
      return name;
    }
  }

  return null;
}

/**
 * Extract guest social links from YouTube description
 * @param description - The YouTube video description
 * @param guestName - The guest's name for filtering links
 * @returns Object containing found social links
 */
export function extractGuestLinks(
  description: string,
  guestName: string
): GuestSocialLinks {
  const social: GuestSocialLinks = {};

  if (!description || !guestName) {
    return social;
  }

  // Find the Links section
  const linksMatch = description.match(/Links:\s*\n([\s\S]*?)(?:\n\n|$)/i);
  if (!linksMatch) {
    return social;
  }

  const linksSection = linksMatch[1];
  const lines = linksSection.split("\n");

  // Get first name for partial matching
  const firstName = guestName.split(" ")[0].toLowerCase();

  for (const line of lines) {
    const lineLower = line.toLowerCase();

    // Skip lines that don't mention the guest
    if (
      !lineLower.includes(firstName) &&
      !lineLower.includes("'s") &&
      !lineLower.includes(" on ")
    ) {
      // Skip non-guest lines (project links, etc.)
      if (
        lineLower.includes("previous") ||
        lineLower.includes("live stream") ||
        lineLower.includes("episode")
      ) {
        continue;
      }
    }

    // Extract URL from line
    const urlMatch = line.match(/https?:\/\/[^\s,]+/i);
    if (!urlMatch) {
      continue;
    }

    const url = urlMatch[0].trim();

    // Categorize by platform
    if (
      (lineLower.includes("website") || lineLower.includes("'s site")) &&
      !social.website
    ) {
      social.website = url;
    } else if (
      (lineLower.includes("twitter") || lineLower.includes(" on x,")) &&
      !social.twitter
    ) {
      social.twitter = url;
    } else if (lineLower.includes("bluesky") && !social.bluesky) {
      social.bluesky = url;
    } else if (
      lineLower.includes("linkedin") &&
      !social.linkedin &&
      url.includes("linkedin.com")
    ) {
      social.linkedin = url;
    } else if (
      lineLower.includes("github") &&
      !social.github &&
      url.includes("github.com")
    ) {
      social.github = url;
    } else if (
      lineLower.includes("youtube") &&
      !social.youtube &&
      url.includes("youtube.com")
    ) {
      social.youtube = url;
    } else if (
      lineLower.includes("twitch") &&
      !social.twitch &&
      url.includes("twitch.tv")
    ) {
      social.twitch = url;
    } else if (!social.website && lineLower.includes(firstName)) {
      // If no website yet and line mentions guest, assume it's their website
      // (unless it's a social platform)
      if (
        !url.includes("twitter.com") &&
        !url.includes("x.com") &&
        !url.includes("github.com") &&
        !url.includes("linkedin.com") &&
        !url.includes("youtube.com") &&
        !url.includes("twitch.tv") &&
        !url.includes("bsky.app")
      ) {
        social.website = url;
      }
    }
  }

  return social;
}

/**
 * Parse guest information from YouTube description
 * @param description - The YouTube video description
 * @returns Parsed guest data or null if no guest found
 */
export function parseGuestFromDescription(
  description: string
): ParsedGuest | null {
  const name = extractGuestName(description);

  if (!name) {
    return null;
  }

  const social = extractGuestLinks(description, name);

  return {
    name,
    social,
  };
}
