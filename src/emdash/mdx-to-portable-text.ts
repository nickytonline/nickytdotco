import { markdownToPortableText } from "emdash/client";

export interface PortableTextNode {
  _type: string;
  _key?: string;
  id?: string;
  [key: string]: unknown;
}

const MEDIA_COMPONENTS = new Set([
  "Embed",
  "CodePenEmbed",
  "CodeSandboxEmbed",
  "DevLinkEmbed",
  "GenericEmbed",
  "GitHubEmbed",
  "InstagramEmbed",
  "SpotifyEmbed",
  "TwitchEmbed",
  "TwitterEmbed",
  "VimeoEmbed",
  "YouTubeEmbed",
]);

const COMPONENT_PATTERN =
  /<([A-Z][A-Za-z0-9]*)((?:\s(?:[^>"']|"[^"]*"|'[^']*')*)?)\s*(?:\/>|>\s*<\/\1>)/g;

const ATTR_PATTERN = /(\w+)=(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of source.matchAll(ATTR_PATTERN)) {
    const raw = match[2] ?? match[3] ?? match[4] ?? "";
    attrs[match[1]] = raw.trim().replace(/^['"]|['"]$/g, "");
  }
  return attrs;
}

/** URL that `<Embed />` can route back to the original media component. */
export function mediaComponentToUrl(
  name: string,
  attrs: Record<string, string>
): string | null {
  if (!MEDIA_COMPONENTS.has(name)) return null;

  if (name === "TwitterEmbed") {
    const tweetId = attrs.tweetId ?? "";
    if (!tweetId) return null;
    if (isHttpUrl(tweetId)) return tweetId;
    return `https://twitter.com/i/status/${tweetId}`;
  }

  if (name === "YouTubeEmbed") {
    const videoId = attrs.videoId ?? "";
    if (!/^[\w-]{6,}$/.test(videoId)) return null;
    const url = new URL("https://www.youtube.com/watch");
    url.searchParams.set("v", videoId);
    if (attrs.startTime) url.searchParams.set("start", attrs.startTime);
    return url.toString();
  }

  if (name === "CodeSandboxEmbed") {
    const sandboxId = attrs.sandboxId ?? "";
    if (!sandboxId) return null;
    if (isHttpUrl(sandboxId)) return sandboxId;
    return `https://codesandbox.io/s/${sandboxId}`;
  }

  if (name === "VimeoEmbed") {
    const videoId = attrs.videoId ?? "";
    if (!videoId) return null;
    if (isHttpUrl(videoId)) return videoId;
    return `https://vimeo.com/${videoId}`;
  }

  if (name === "TwitchEmbed") {
    const videoId = attrs.videoId ?? "";
    if (!videoId) return null;
    if (isHttpUrl(videoId)) return videoId;
    return `https://www.twitch.tv/videos/${videoId}`;
  }

  if (name === "SpotifyEmbed") {
    const uri = attrs.uri ?? "";
    if (!uri) return null;
    if (isHttpUrl(uri)) return uri;
    const path = uri.replace(/^spotify:/, "").replace(/:/g, "/");
    return `https://open.spotify.com/${path}`;
  }

  if (name === "InstagramEmbed") {
    const url = attrs.url ?? "";
    if (!url) return null;
    if (isHttpUrl(url)) return url;
    return `https://www.instagram.com/p/${url.replace(/^\/+|\/+$/g, "")}/`;
  }

  const url = attrs.url ?? "";
  return isHttpUrl(url) ? url : null;
}

function stashProtectedRegions(source: string): {
  text: string;
  slots: string[];
} {
  const slots: string[] = [];
  const stash = (block: string) => {
    const token = `%%SLOT${slots.length}%%`;
    slots.push(block);
    return token;
  };
  let text = source.replace(/```[\s\S]*?```/g, (block) => stash(block));
  text = text.replace(/`[^`\n]*`/g, (block) => stash(block));
  text = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  return { text, slots };
}

function restoreProtectedRegions(text: string, slots: string[]): string {
  return text.replace(/%%SLOT(\d+)%%/g, (_, index: string) => {
    return slots[Number(index)] ?? "";
  });
}

function replaceMediaComponents(source: string): string {
  let index = 0;
  return source.replace(
    COMPONENT_PATTERN,
    (original, name: string, attrSource: string) => {
      const url = mediaComponentToUrl(name, parseAttrs(attrSource ?? ""));
      if (!url) return original;
      const block = {
        _type: "embed",
        _key: `embed-${index++}`,
        id: url,
      };
      return `\n\n<!--ec:block ${JSON.stringify(block)} -->\n\n`;
    }
  );
}

function isListLine(line: string): boolean {
  return /^(\s*)([-*+]|\d+\.)\s+/.test(line);
}

function isStructuralLine(line: string): boolean {
  return (
    /^(#{1,6}\s|>\s|<!--ec:block|!\[)/.test(line) ||
    isListLine(line) ||
    /^%%SLOT\d+%%$/.test(line.trim())
  );
}

/** Join wrapped prose lines so each paragraph is one Portable Text block. */
export function collapseSoftBreaks(markdown: string): string {
  const lines = markdown.split("\n");
  const output: string[] = [];
  let buffer = "";

  const flush = () => {
    if (!buffer) return;
    output.push(buffer);
    buffer = "";
  };

  for (const line of lines) {
    if (line.trim() === "") {
      flush();
      output.push("");
      continue;
    }
    if (isStructuralLine(line)) {
      flush();
      output.push(line);
      continue;
    }
    const previous = output.at(-1);
    if (!buffer && previous && isListLine(previous) && /^\s+\S/.test(line)) {
      output[output.length - 1] = `${previous} ${line.trim()}`;
      continue;
    }
    buffer = buffer ? `${buffer} ${line.trim()}` : line.trim();
  }
  flush();
  return output.join("\n");
}

function stripModuleLines(source: string): string {
  return source
    .split("\n")
    .filter((line) => !/^\s*import\s/.test(line) && !/^\s*export\s/.test(line))
    .join("\n");
}

/** Turn an MDX post body into Portable Text, keeping media as embed blocks. */
export function mdxBodyToPortableText(body: string): PortableTextNode[] {
  const protectedBody = stashProtectedRegions(stripModuleLines(body));
  const withEmbeds = replaceMediaComponents(protectedBody.text);
  const collapsed = collapseSoftBreaks(withEmbeds);
  const markdown = restoreProtectedRegions(collapsed, protectedBody.slots);
  return markdownToPortableText(markdown) as PortableTextNode[];
}
