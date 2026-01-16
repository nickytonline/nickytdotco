import type { LiveLoader } from "astro/loaders";

export interface BrewfileEntry {
  id: string; // The type-name unique identifier
  type: "brew" | "cask" | "mas" | "tap";
  name: string; // the raw name from the brewfile
  displayName: string; // the pretty name from the API or raw name
  description?: string;
  homepage?: string;
  masId?: string;
  tap?: string;
  [key: string]: unknown;
}

const BREWFILE_URL =
  "https://raw.githubusercontent.com/nickytonline/dotfiles/main/Brewfile";
const BREW_API_URL = "https://formulae.brew.sh/api/formula.json";
const CASK_API_URL = "https://formulae.brew.sh/api/cask.json";
const ITUNES_LOOKUP_URL = "https://itunes.apple.com/lookup?id=";

function prettify(name: string): string {
  if (!name.includes("-") && !name.includes("_") && name.length <= 3) {
    return name;
  }

  let pretty = name
    .split(/[-_]/)
    .map((word) => {
      if (word.toLowerCase() === "cli") return "CLI";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  // Special case for common prefixes like "Block"
  if (pretty.startsWith("Block ") && pretty.length > 6) {
    pretty = pretty.replace("Block ", "");
  }

  return pretty;
}

function shortenDescription(desc?: string): string | undefined {
  if (!desc) return desc;
  // Get the first sentence by looking for a period followed by space or newline
  // We trim to handle cases where there might be leading/trailing whitespace
  const firstSentence = desc.split(/\.\s|\n/)[0].trim();
  if (firstSentence && !firstSentence.endsWith(".")) {
    return `${firstSentence}.`;
  }
  return firstSentence;
}

async function fetchAndParseBrewfile(): Promise<BrewfileEntry[]> {
  let brewfileText = "";
  let formulae: Array<{ name: string; desc?: string; homepage?: string }> = [];
  let casks: Array<{
    token: string;
    name?: string[];
    desc?: string;
    homepage?: string;
  }> = [];
  let masMetadata: Array<{
    trackId: number;
    trackName: string;
    description: string;
    trackViewUrl: string;
  }> = [];

  try {
    const brewfileRes = await fetch(BREWFILE_URL);
    if (!brewfileRes.ok) throw new Error("Brewfile fetch failed");
    brewfileText = await brewfileRes.text();

    // Extract MAS IDs for bulk lookup
    const masIds = [
      ...brewfileText.matchAll(/^mas\s+"[^"]+",\s*id:\s*(\d+)/gm),
    ].map((m) => m[1]);

    const fetches: Promise<Response>[] = [
      fetch(BREW_API_URL),
      fetch(CASK_API_URL),
    ];
    if (masIds.length > 0) {
      fetches.push(fetch(`${ITUNES_LOOKUP_URL}${masIds.join(",")}`));
    }

    const [brewApiRes, caskApiRes, itunesApiRes] = await Promise.all(fetches);

    formulae = (await brewApiRes.json()) as typeof formulae;
    casks = (await caskApiRes.json()) as typeof casks;

    if (itunesApiRes) {
      const itunesData = (await itunesApiRes.json()) as {
        results: typeof masMetadata;
      };
      masMetadata = itunesData.results || [];
    }
  } catch (error) {
    console.error("Error fetching brew data:", error);
    if (!brewfileText) throw error;
  }

  const formulaeMap = new Map(formulae.map((f) => [f.name, f]));
  const casksMap = new Map(casks.map((c) => [c.token, c]));
  const masMap = new Map(masMetadata.map((m) => [String(m.trackId), m]));

  const lines = brewfileText.split("\n");
  const entries: BrewfileEntry[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const brewMatch = trimmed.match(/^brew\s+"([^"]+)"/);
    if (brewMatch) {
      const fullName = brewMatch[1];
      const name = fullName.split("/").pop() || fullName;
      const tap = fullName.includes("/")
        ? fullName.split("/").slice(0, 2).join("/")
        : undefined;

      const meta = formulaeMap.get(name) || formulaeMap.get(fullName);

      entries.push({
        id: `brew-${fullName}`,
        type: "brew",
        name: fullName,
        displayName: prettify(name),
        tap: tap,
        description: shortenDescription(meta?.desc),
        homepage: meta?.homepage,
      });
      continue;
    }

    const caskMatch = trimmed.match(/^cask\s+"([^"]+)"/);
    if (caskMatch) {
      const token = caskMatch[1];
      const meta = casksMap.get(token);

      entries.push({
        id: `cask-${token}`,
        type: "cask",
        name: token,
        displayName: meta?.name?.[0] || prettify(token),
        description: shortenDescription(meta?.desc),
        homepage: meta?.homepage,
      });
      continue;
    }

    const masMatch = trimmed.match(/^mas\s+"([^"]+)",\s*id:\s*(\d+)/);
    if (masMatch) {
      const id = masMatch[2];
      const masInfo = masMap.get(id);

      entries.push({
        id: `mas-${id}`,
        type: "mas",
        name: masMatch[1],
        displayName: masInfo?.trackName || masMatch[1],
        masId: id,
        description: shortenDescription(masInfo?.description) || "",
        homepage: masInfo?.trackViewUrl || `https://apps.apple.com/app/id${id}`,
      });
      continue;
    }

    const tapMatch = trimmed.match(/^tap\s+"([^"]+)"/);
    if (tapMatch) {
      entries.push({
        id: `tap-${tapMatch[1]}`,
        type: "tap",
        name: tapMatch[1],
        displayName: tapMatch[1],
        homepage: `https://github.com/${tapMatch[1]}`,
      });
      continue;
    }
  }

  return entries;
}

export const brewfileLoader: LiveLoader<BrewfileEntry, { id: string }> = {
  name: "brewfile",
  async loadCollection() {
    try {
      const entries = await fetchAndParseBrewfile();
      return {
        entries: entries.map((entry) => ({
          id: entry.id,
          data: entry,
        })),
      };
    } catch (error) {
      return {
        entries: [],
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },
  async loadEntry({ filter }) {
    if (!filter?.id) {
      return { error: new Error("Missing entry id filter.") };
    }

    try {
      const entries = await fetchAndParseBrewfile();
      const entry = entries.find((e) => e.id === filter.id);

      if (!entry) {
        return { error: new Error(`Entry not found: ${filter.id}`) };
      }

      return {
        id: entry.id,
        data: entry,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },
};
