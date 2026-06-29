# Update Featured Content

You are curating the "Featured" section of Nick Taylor's personal website (nickyt.co). This runs biweekly.

## Site Positioning

Nick Taylor is a Developer Advocate at Pomerium specializing in **Zero Trust security**, **MCP (Model Context Protocol)**, and **agentic AI**. He is a GitHub Star, AAIF Ambassador, AWS Community Builder, and Microsoft MVP.

The home page has a "Featured" section that surfaces evergreen, best-of content — distinct from the "Latest" feed. Your job is to select the content that best reinforces this positioning for hiring managers, event organizers, and podcasters landing on the site.

## Your Task

1. **Read all content frontmatter** from these three collections:
   - `src/content/talks/*.md` — conference talks
   - `src/content/guides/*.md` — hands-on tutorials
   - `src/content/blog/*.mdx` — blog posts

   **Only consider content published within the last 12 months** (based on the `date` frontmatter field). Ignore anything older — this keeps featured content fresh and speeds up the curation. Use shell commands (grep, awk, sed) to filter by date efficiently rather than reading each file individually. For each item, you need: title, date, tags, excerpt/description, and whether it has a video recording or is upcoming.

2. **Remove all existing `featured: true` flags** from every file across all three collections. Use a single shell command (e.g., `sed -i`) to strip `featured: true` lines from all files at once.

3. **Select the best content to feature** and add `featured: true` to those files' frontmatter. Selection criteria:

   ### Talks (select up to 2)
   - Must have a video recording (has `video` frontmatter with a URL)
   - Must NOT be upcoming (`upcoming: true` excludes it — upcoming talks go in the Latest section)
   - Prefer talks at prestigious venues (BlackHat, AI Engineer, MCP Dev Summit, All Things Open, KubeCon, SREday)
   - Prefer talks directly about MCP security, Zero Trust for AI agents, or agentic AI access control
   - Prefer talks with slide decks or additional links (shows depth)

   ### Guides (select up to 2)
   - All guides are candidates
   - Prefer guides about Pomerium, Zero Trust, or security infrastructure
   - Prefer guides with cover images

   ### Blog Posts (select up to 2)
   - Prefer posts tagged with `mcp`, `security`, `ai`, `agenticai`, or `zero trust`
   - Prefer posts with cover images
   - Avoid off-topic posts (hardware reviews, shell tips, general dev tooling) unless they have a strong security angle
   - Avoid posts that duplicate a featured talk's topic (the talk is the stronger signal)

4. **Output a summary** of your selections. For each selected item, provide:
   - File path
   - Title
   - One-sentence reason why it was chosen

   Also list any items that had `featured: true` removed and were NOT re-selected (i.e., demoted items), with a brief reason.

## Important Notes

- The `featured: true` line should be placed in the YAML frontmatter, typically after the last existing field and before the closing `---`
- Do not change any other frontmatter fields or file content
- Do not create new files
- Do not modify files outside `src/content/talks/`, `src/content/guides/`, and `src/content/blog/`
- If a collection has fewer items than the max, feature fewer — don't force it
- Be conservative: it's better to feature 2 strong items than 3 mediocre ones
