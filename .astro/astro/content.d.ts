declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"-webpack-secrets-jg.md": {
	id: "-webpack-secrets-jg.md";
  slug: "-webpack-secrets-jg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2018-resolutions-1deo.md": {
	id: "2018-resolutions-1deo.md";
  slug: "2018-resolutions-1deo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2024-year-in-review-1p7p.md": {
	id: "2024-year-in-review-1p7p.md";
  slug: "2024-year-in-review-1p7p";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"a--notification-code-pen-4o0n.md": {
	id: "a--notification-code-pen-4o0n.md";
  slug: "a--notification-code-pen-4o0n";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"a-new-year-a-new-start-i-m-joining-the-dev-team-3ap0.md": {
	id: "a-new-year-a-new-start-i-m-joining-the-dev-team-3ap0.md";
  slug: "a-new-year-a-new-start-i-m-joining-the-dev-team-3ap0";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"a11y-twitter-a-browser-extension-for-making-twitter-more-accessible-17kg.md": {
	id: "a11y-twitter-a-browser-extension-for-making-twitter-more-accessible-17kg.md";
  slug: "a11y-twitter-a-browser-extension-for-making-twitter-more-accessible-17kg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-1-building-data-visualizations-with-goose-g7f.md": {
	id: "advent-of-ai-2025-day-1-building-data-visualizations-with-goose-g7f.md";
  slug: "advent-of-ai-2025-day-1-building-data-visualizations-with-goose-g7f";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-1-getting-goose-to-generate-daily-fortunes-in-ci-3alp.md": {
	id: "advent-of-ai-2025-day-1-getting-goose-to-generate-daily-fortunes-in-ci-3alp.md";
  slug: "advent-of-ai-2025-day-1-getting-goose-to-generate-daily-fortunes-in-ci-3alp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-14-agent-skills-4d48.md": {
	id: "advent-of-ai-2025-day-14-agent-skills-4d48.md";
  slug: "advent-of-ai-2025-day-14-agent-skills-4d48";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-15-goose-sub-recipes-3mnd.md": {
	id: "advent-of-ai-2025-day-15-goose-sub-recipes-3mnd.md";
  slug: "advent-of-ai-2025-day-15-goose-sub-recipes-3mnd";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-16-planning-with-goosehints-875.md": {
	id: "advent-of-ai-2025-day-16-planning-with-goosehints-875.md";
  slug: "advent-of-ai-2025-day-16-planning-with-goosehints-875";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-17-building-a-wishlist-app-with-goose-and-mcp-ui-330l.md": {
	id: "advent-of-ai-2025-day-17-building-a-wishlist-app-with-goose-and-mcp-ui-330l.md";
  slug: "advent-of-ai-2025-day-17-building-a-wishlist-app-with-goose-and-mcp-ui-330l";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-2-building-a-winter-festival-game-41eg.md": {
	id: "advent-of-ai-2025-day-2-building-a-winter-festival-game-41eg.md";
  slug: "advent-of-ai-2025-day-2-building-a-winter-festival-game-41eg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-4-building-a-winter-festival-website-with-goose-3oac.md": {
	id: "advent-of-ai-2025-day-4-building-a-winter-festival-website-with-goose-3oac.md";
  slug: "advent-of-ai-2025-day-4-building-a-winter-festival-website-with-goose-3oac";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-5-i-built-a-touchless-flight-tracker-you-control-with-hand-gestures-1jn8.md": {
	id: "advent-of-ai-2025-day-5-i-built-a-touchless-flight-tracker-you-control-with-hand-gestures-1jn8.md";
  slug: "advent-of-ai-2025-day-5-i-built-a-touchless-flight-tracker-you-control-with-hand-gestures-1jn8";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-6-automating-github-issue-triage-with-goose-1pn5.md": {
	id: "advent-of-ai-2025-day-6-automating-github-issue-triage-with-goose-1pn5.md";
  slug: "advent-of-ai-2025-day-6-automating-github-issue-triage-with-goose-1pn5";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-7-goose-recipes-5d1c.md": {
	id: "advent-of-ai-2025-day-7-goose-recipes-5d1c.md";
  slug: "advent-of-ai-2025-day-7-goose-recipes-5d1c";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-8-messy-data-to-structured-output-25i2.md": {
	id: "advent-of-ai-2025-day-8-messy-data-to-structured-output-25i2.md";
  slug: "advent-of-ai-2025-day-8-messy-data-to-structured-output-25i2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-2025-day-9-building-a-gift-tag-generator-with-goose-recipes-3i73.md": {
	id: "advent-of-ai-2025-day-9-building-a-gift-tag-generator-with-goose-recipes-3i73.md";
  slug: "advent-of-ai-2025-day-9-building-a-gift-tag-generator-with-goose-recipes-3i73";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-day-10-understanding-arguments-in-goose-recipes-2obg.md": {
	id: "advent-of-ai-day-10-understanding-arguments-in-goose-recipes-2obg.md";
  slug: "advent-of-ai-day-10-understanding-arguments-in-goose-recipes-2obg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-day-11-goose-subagents-2n2.md": {
	id: "advent-of-ai-day-11-goose-subagents-2n2.md";
  slug: "advent-of-ai-day-11-goose-subagents-2n2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-day-12-mcp-sampling-29b4.md": {
	id: "advent-of-ai-day-12-mcp-sampling-29b4.md";
  slug: "advent-of-ai-day-12-mcp-sampling-29b4";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"advent-of-ai-day-13-goose-terminal-integration-145p.md": {
	id: "advent-of-ai-day-13-goose-terminal-integration-145p.md";
  slug: "advent-of-ai-day-13-goose-terminal-integration-145p";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"an-a11y-extension-coming-to-a-browser-near-you-1mg2.md": {
	id: "an-a11y-extension-coming-to-a-browser-near-you-1mg2.md";
  slug: "an-a11y-extension-coming-to-a-browser-near-you-1mg2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"an-enhanced-typescript-playground-49j6.md": {
	id: "an-enhanced-typescript-playground-49j6.md";
  slug: "an-enhanced-typescript-playground-49j6";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"an-nft-based-game-1jfk.md": {
	id: "an-nft-based-game-1jfk.md";
  slug: "an-nft-based-game-1jfk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"any-contribution-to-open-source-is-valuable-57d3.md": {
	id: "any-contribution-to-open-source-is-valuable-57d3.md";
  slug: "any-contribution-to-open-source-is-valuable-57d3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"anyone-can-commit-code-as-you-on-github-heres-how-to-stop-them-2in7.md": {
	id: "anyone-can-commit-code-as-you-on-github-heres-how-to-stop-them-2in7.md";
  slug: "anyone-can-commit-code-as-you-on-github-heres-how-to-stop-them-2in7";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"app-to-grab-your-revue-newsletters-1gci.md": {
	id: "app-to-grab-your-revue-newsletters-1gci.md";
  slug: "app-to-grab-your-revue-newsletters-1gci";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"automate-and-merge-pull-requests-using-github-actions-and-the-github-cli-4lo6.md": {
	id: "automate-and-merge-pull-requests-using-github-actions-and-the-github-cli-4lo6.md";
  slug: "automate-and-merge-pull-requests-using-github-actions-and-the-github-cli-4lo6";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"benq-rd280u-review-a-28-4k-monitor-built-for-developers-20d2.md": {
	id: "benq-rd280u-review-a-28-4k-monitor-built-for-developers-20d2.md";
  slug: "benq-rd280u-review-a-28-4k-monitor-built-for-developers-20d2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"benq-screenbar-halo-monitor-light-review-54ej.md": {
	id: "benq-screenbar-halo-monitor-light-review-54ej.md";
  slug: "benq-screenbar-halo-monitor-light-review-54ej";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"boost-productivity-with-the-github-cli-2mne.md": {
	id: "boost-productivity-with-the-github-cli-2mne.md";
  slug: "boost-productivity-with-the-github-cli-2mne";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"build-framework-agnostic-components-with-mitosis-4c4k.md": {
	id: "build-framework-agnostic-components-with-mitosis-4c4k.md";
  slug: "build-framework-agnostic-components-with-mitosis-4c4k";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"build-your-first-or-next-mcp-server-with-the-typescript-mcp-template-3k3f.md": {
	id: "build-your-first-or-next-mcp-server-with-the-typescript-mcp-template-3k3f.md";
  slug: "build-your-first-or-next-mcp-server-with-the-typescript-mcp-template-3k3f";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"building-an-ollama-powered-github-copilot-extension-2l4n.md": {
	id: "building-an-ollama-powered-github-copilot-extension-2l4n.md";
  slug: "building-an-ollama-powered-github-copilot-extension-2l4n";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"building-out-the-go-playground-liquid-tag-for-dev-with-chuck-smith-32he.md": {
	id: "building-out-the-go-playground-liquid-tag-for-dev-with-chuck-smith-32he.md";
  slug: "building-out-the-go-playground-liquid-tag-for-dev-with-chuck-smith-32he";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"can-you-create-the-great-redux-store-4eo1.md": {
	id: "can-you-create-the-great-redux-store-4eo1.md";
  slug: "can-you-create-the-great-redux-store-4eo1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"challenging-the-skeptics-unveiling-the-undeniable-goodness-of-tailwind-css-4doc.md": {
	id: "challenging-the-skeptics-unveiling-the-undeniable-goodness-of-tailwind-css-4doc.md";
  slug: "challenging-the-skeptics-unveiling-the-undeniable-goodness-of-tailwind-css-4doc";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"changelog-dev-has-some-stories-for-you-15kn.md": {
	id: "changelog-dev-has-some-stories-for-you-15kn.md";
  slug: "changelog-dev-has-some-stories-for-you-15kn";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"changelog-dev-upgraded-to-webpacker-4-babel-7-1mm4.md": {
	id: "changelog-dev-upgraded-to-webpacker-4-babel-7-1mm4.md";
  slug: "changelog-dev-upgraded-to-webpacker-4-babel-7-1mm4";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"changelog-frontend-edition-30l7.md": {
	id: "changelog-frontend-edition-30l7.md";
  slug: "changelog-frontend-edition-30l7";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"changelog-subscribe-to-a-post-s-threads-v2-5fn0.md": {
	id: "changelog-subscribe-to-a-post-s-threads-v2-5fn0.md";
  slug: "changelog-subscribe-to-a-post-s-threads-v2-5fn0";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"contributing-to-open-source-and-how-open-sauced-can-help-5d97.md": {
	id: "contributing-to-open-source-and-how-open-sauced-can-help-5d97.md";
  slug: "contributing-to-open-source-and-how-open-sauced-can-help-5d97";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"cool-rust-and-webassembly-resource-33j6.md": {
	id: "cool-rust-and-webassembly-resource-33j6.md";
  slug: "cool-rust-and-webassembly-resource-33j6";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"creating-an-og-image-using-react-and-netlify-edge-functions-563a.md": {
	id: "creating-an-og-image-using-react-and-netlify-edge-functions-563a.md";
  slug: "creating-an-og-image-using-react-and-netlify-edge-functions-563a";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"creating-your-first-github-copilot-extension-a-step-by-step-guide-28g0.md": {
	id: "creating-your-first-github-copilot-extension-a-step-by-step-guide-28g0.md";
  slug: "creating-your-first-github-copilot-extension-a-step-by-step-guide-28g0";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"css-mask-property-2d42.md": {
	id: "css-mask-property-2d42.md";
  slug: "css-mask-property-2d42";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"dev-as-a-headless-cms-for-your-gatsby-site-4mj2.md": {
	id: "dev-as-a-headless-cms-for-your-gatsby-site-4mj2.md";
  slug: "dev-as-a-headless-cms-for-your-gatsby-site-4mj2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"dev-to-s-frontend-a-brain-dump-in-one-act-7mg.md": {
	id: "dev-to-s-frontend-a-brain-dump-in-one-act-7mg.md";
  slug: "dev-to-s-frontend-a-brain-dump-in-one-act-7mg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"dev-to-with-a-typescript-or-flow-frontend-codebase-1n33.md": {
	id: "dev-to-with-a-typescript-or-flow-frontend-codebase-1n33.md";
  slug: "dev-to-with-a-typescript-or-flow-frontend-codebase-1n33";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"dom-chef---build-dom-elements-with-jsx-5fi.md": {
	id: "dom-chef---build-dom-elements-with-jsx-5fi.md";
  slug: "dom-chef---build-dom-elements-with-jsx-5fi";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"dont-get-rate-limited-use-lets-encrypt-staging-4kk2.md": {
	id: "dont-get-rate-limited-use-lets-encrypt-staging-4kk2.md";
  slug: "dont-get-rate-limited-use-lets-encrypt-staging-4kk2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"ecosystem-and-frameworks-my-role-at-netlify-306b.md": {
	id: "ecosystem-and-frameworks-my-role-at-netlify-306b.md";
  slug: "ecosystem-and-frameworks-my-role-at-netlify-306b";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"enabling-keyboard-navigation-on-your-mac-1hjb.md": {
	id: "enabling-keyboard-navigation-on-your-mac-1hjb.md";
  slug: "enabling-keyboard-navigation-on-your-mac-1hjb";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"evaluating-the-new-microsoft-edge-4m1j.md": {
	id: "evaluating-the-new-microsoft-edge-4m1j.md";
  slug: "evaluating-the-new-microsoft-edge-4m1j";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"form-and-function-how-i-lost-my-submit-button-got-it-back-5b91.md": {
	id: "form-and-function-how-i-lost-my-submit-button-got-it-back-5b91.md";
  slug: "form-and-function-how-i-lost-my-submit-button-got-it-back-5b91";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"frontend-developer-resources-2022-4cp2.md": {
	id: "frontend-developer-resources-2022-4cp2.md";
  slug: "frontend-developer-resources-2022-4cp2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"frontend-developer-resources-246j.md": {
	id: "frontend-developer-resources-246j.md";
  slug: "frontend-developer-resources-246j";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"funding-in-open-source-4i6k.md": {
	id: "funding-in-open-source-4i6k.md";
  slug: "funding-in-open-source-4i6k";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"funding-in-open-source-a-conversation-with-chad-whitacre-4264.md": {
	id: "funding-in-open-source-a-conversation-with-chad-whitacre-4264.md";
  slug: "funding-in-open-source-a-conversation-with-chad-whitacre-4264";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"getting-mcfly-working-on-ubuntu-server-without-losing-your-mind-2k5e.md": {
	id: "getting-mcfly-working-on-ubuntu-server-without-losing-your-mind-2k5e.md";
  slug: "getting-mcfly-working-on-ubuntu-server-without-losing-your-mind-2k5e";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"getting-saucy-i-joined-opensauced-2ici.md": {
	id: "getting-saucy-i-joined-opensauced-2ici.md";
  slug: "getting-saucy-i-joined-opensauced-2ici";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"getting-started-with-react-storybook-9jh.md": {
	id: "getting-started-with-react-storybook-9jh.md";
  slug: "getting-started-with-react-storybook-9jh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"getting-started-with-regular-expressions-11dg.md": {
	id: "getting-started-with-regular-expressions-11dg.md";
  slug: "getting-started-with-regular-expressions-11dg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"getting-started-with-streaming-on-twitch-4im7.md": {
	id: "getting-started-with-streaming-on-twitch-4im7.md";
  slug: "getting-started-with-streaming-on-twitch-4im7";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"git-history-20nh.md": {
	id: "git-history-20nh.md";
  slug: "git-history-20nh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"git-worktrees-git-done-right-2p7f.md": {
	id: "git-worktrees-git-done-right-2p7f.md";
  slug: "git-worktrees-git-done-right-2p7f";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"github-actions-a-maintainers-best-friend-488n.md": {
	id: "github-actions-a-maintainers-best-friend-488n.md";
  slug: "github-actions-a-maintainers-best-friend-488n";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"gos-singleflight-package-and-why-its-awesome-for-concurrent-requests-4122.md": {
	id: "gos-singleflight-package-and-why-its-awesome-for-concurrent-requests-4122.md";
  slug: "gos-singleflight-package-and-why-its-awesome-for-concurrent-requests-4122";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"hacktoberfest-preptember-3p7.md": {
	id: "hacktoberfest-preptember-3p7.md";
  slug: "hacktoberfest-preptember-3p7";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"handy-js-snippets-352f.md": {
	id: "handy-js-snippets-352f.md";
  slug: "handy-js-snippets-352f";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"have-questions-about-eslint-2ahp.md": {
	id: "have-questions-about-eslint-2ahp.md";
  slug: "have-questions-about-eslint-2ahp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"have-you-moved-from-twitter-to-mastodon-for-social-media-4a37.md": {
	id: "have-you-moved-from-twitter-to-mastodon-for-social-media-4a37.md";
  slug: "have-you-moved-from-twitter-to-mastodon-for-social-media-4a37";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"hi-im-nick-taylor.md": {
	id: "hi-im-nick-taylor.md";
  slug: "hi-im-nick-taylor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"hot-reloading-in-rust-4i1c.md": {
	id: "hot-reloading-in-rust-4i1c.md";
  slug: "hot-reloading-in-rust-4i1c";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"how-i-automated-my-github-profile-and-you-can-too-399e.md": {
	id: "how-i-automated-my-github-profile-and-you-can-too-399e.md";
  slug: "how-i-automated-my-github-profile-and-you-can-too-399e";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"how-i-review-pull-requests-44nl.md": {
	id: "how-i-review-pull-requests-44nl.md";
  slug: "how-i-review-pull-requests-44nl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"how-i-used-claude-code-to-speed-up-my-shell-startup-by-95-m0f.md": {
	id: "how-i-used-claude-code-to-speed-up-my-shell-startup-by-95-m0f.md";
  slug: "how-i-used-claude-code-to-speed-up-my-shell-startup-by-95-m0f";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"how-to-debug-a-firefox-add-on-extension-489f.md": {
	id: "how-to-debug-a-firefox-add-on-extension-489f.md";
  slug: "how-to-debug-a-firefox-add-on-extension-489f";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"html-data-attributes-one-of-the-original-state-management-libraries-8bf.md": {
	id: "html-data-attributes-one-of-the-original-state-management-libraries-8bf.md";
  slug: "html-data-attributes-one-of-the-original-state-management-libraries-8bf";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"html-forms-back-to-basics-1mph.md": {
	id: "html-forms-back-to-basics-1mph.md";
  slug: "html-forms-back-to-basics-1mph";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"i-built-my-first-dapp-3pbm.md": {
	id: "i-built-my-first-dapp-3pbm.md";
  slug: "i-built-my-first-dapp-3pbm";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"i-started-a-javascript-stream-on-twitch-4f3g.md": {
	id: "i-started-a-javascript-stream-on-twitch-4f3g.md";
  slug: "i-started-a-javascript-stream-on-twitch-4f3g";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"i-started-a-newsletter-3g8d.md": {
	id: "i-started-a-newsletter-3g8d.md";
  slug: "i-started-a-newsletter-3g8d";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"i-switched-shell-history-tools-heres-why-m6h.md": {
	id: "i-switched-shell-history-tools-heres-why-m6h.md";
  slug: "i-switched-shell-history-tools-heres-why-m6h";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"i-ve-started-to-live-code-on-twitch-for-dev-13cn.md": {
	id: "i-ve-started-to-live-code-on-twitch-for-dev-13cn.md";
  slug: "i-ve-started-to-live-code-on-twitch-for-dev-13cn";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"im-joining-pomerium-225j.md": {
	id: "im-joining-pomerium-225j.md";
  slug: "im-joining-pomerium-225j";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"impressions-of-polywork-3pbp.md": {
	id: "impressions-of-polywork-3pbp.md";
  slug: "impressions-of-polywork-3pbp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"infer-types-to-avoid-explicit-types-1pnn.md": {
	id: "infer-types-to-avoid-explicit-types-1pnn.md";
  slug: "infer-types-to-avoid-explicit-types-1pnn";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"ink-react-for-clis-2l3b.md": {
	id: "ink-react-for-clis-2l3b.md";
  slug: "ink-react-for-clis-2l3b";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"introducing-the-devto-mcp-server-42jg.md": {
	id: "introducing-the-devto-mcp-server-42jg.md";
  slug: "introducing-the-devto-mcp-server-42jg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"introducing-the-opensauced-pizza-github-action-automate-your-repository-management-44aj.md": {
	id: "introducing-the-opensauced-pizza-github-action-automate-your-repository-management-44aj.md";
  slug: "introducing-the-opensauced-pizza-github-action-automate-your-repository-management-44aj";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"jamstack-and-serverless-with-jason-lengstorf-3jdl.md": {
	id: "jamstack-and-serverless-with-jason-lengstorf-3jdl.md";
  slug: "jamstack-and-serverless-with-jason-lengstorf-3jdl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"kettlebells-code-dev-health-3eim.md": {
	id: "kettlebells-code-dev-health-3eim.md";
  slug: "kettlebells-code-dev-health-3eim";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"learning-resources-for-typescript-4g1n.md": {
	id: "learning-resources-for-typescript-4g1n.md";
  slug: "learning-resources-for-typescript-4g1n";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"learning-rust-1h2n.md": {
	id: "learning-rust-1h2n.md";
  slug: "learning-rust-1h2n";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"let-s-pair-during-a-live-coding-session-8he.md": {
	id: "let-s-pair-during-a-live-coding-session-8he.md";
  slug: "let-s-pair-during-a-live-coding-session-8he";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"live-coding-pairing-converting-a-preact-component-to-use-hooks-75e.md": {
	id: "live-coding-pairing-converting-a-preact-component-to-use-hooks-75e.md";
  slug: "live-coding-pairing-converting-a-preact-component-to-use-hooks-75e";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"logitech-ergo-k860-wireless-keyboard-nef.md": {
	id: "logitech-ergo-k860-wireless-keyboard-nef.md";
  slug: "logitech-ergo-k860-wireless-keyboard-nef";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"london-adventures-kubecon-eu-2025-sreday-and-more-3igl.md": {
	id: "london-adventures-kubecon-eu-2025-sreday-and-more-3igl.md";
  slug: "london-adventures-kubecon-eu-2025-sreday-and-more-3igl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"migrating-from-jest-to-vitest-for-your-react-application-1b75.md": {
	id: "migrating-from-jest-to-vitest-for-your-react-application-1b75.md";
  slug: "migrating-from-jest-to-vitest-for-your-react-application-1b75";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"more-engagement-through-series-on-devto-6hb.md": {
	id: "more-engagement-through-series-on-devto-6hb.md";
  slug: "more-engagement-through-series-on-devto-6hb";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"multitenant-database-schemas-4ofc.md": {
	id: "multitenant-database-schemas-4ofc.md";
  slug: "multitenant-database-schemas-4ofc";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-2018-year-in-review-2f0k.md": {
	id: "my-2018-year-in-review-2f0k.md";
  slug: "my-2018-year-in-review-2f0k";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-2019-year-in-review-23i1.md": {
	id: "my-2019-year-in-review-23i1.md";
  slug: "my-2019-year-in-review-23i1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-2020-year-in-review-1p17.md": {
	id: "my-2020-year-in-review-1p17.md";
  slug: "my-2020-year-in-review-1p17";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-2021-year-in-review-3n83.md": {
	id: "my-2021-year-in-review-3n83.md";
  slug: "my-2021-year-in-review-3n83";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-2022-year-in-review-a72.md": {
	id: "my-2022-year-in-review-a72.md";
  slug: "my-2022-year-in-review-a72";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-2023-year-in-review-33ep.md": {
	id: "my-2023-year-in-review-33ep.md";
  slug: "my-2023-year-in-review-33ep";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-2025-year-in-review-3nom.md": {
	id: "my-2025-year-in-review-3nom.md";
  slug: "my-2025-year-in-review-3nom";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-eleventy-meetup-talk-3b2p.md": {
	id: "my-eleventy-meetup-talk-3b2p.md";
  slug: "my-eleventy-meetup-talk-3b2p";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-git-aliases-5dea.md": {
	id: "my-git-aliases-5dea.md";
  slug: "my-git-aliases-5dea";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-hacktoberfest-2019-32i2.md": {
	id: "my-hacktoberfest-2019-32i2.md";
  slug: "my-hacktoberfest-2019-32i2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-impact-at-forem-23mj.md": {
	id: "my-impact-at-forem-23mj.md";
  slug: "my-impact-at-forem-23mj";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-mac-setup-2m05.md": {
	id: "my-mac-setup-2m05.md";
  slug: "my-mac-setup-2m05";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-newsletter-growth-fun-slow-steady-4fpd.md": {
	id: "my-newsletter-growth-fun-slow-steady-4fpd.md";
  slug: "my-newsletter-growth-fun-slow-steady-4fpd";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-shell-aliases-1obk.md": {
	id: "my-shell-aliases-1obk.md";
  slug: "my-shell-aliases-1obk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-talk-on-react-storybook-at-the-js-montreal-meetup-2598.md": {
	id: "my-talk-on-react-storybook-at-the-js-montreal-meetup-2598.md";
  slug: "my-talk-on-react-storybook-at-the-js-montreal-meetup-2598";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-twitch-stream-setup-2m0c.md": {
	id: "my-twitch-stream-setup-2m0c.md";
  slug: "my-twitch-stream-setup-2m0c";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"my-visual-studio-code-setup-2ima.md": {
	id: "my-visual-studio-code-setup-2ima.md";
  slug: "my-visual-studio-code-setup-2ima";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"need-help-picking-a-tabletop-colour-2mki.md": {
	id: "need-help-picking-a-tabletop-colour-2mki.md";
  slug: "need-help-picking-a-tabletop-colour-2mki";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"non-tech-reading-recommendations-55pm.md": {
	id: "non-tech-reading-recommendations-55pm.md";
  slug: "non-tech-reading-recommendations-55pm";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"not-captain-obvious-1boj.md": {
	id: "not-captain-obvious-1boj.md";
  slug: "not-captain-obvious-1boj";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"npx-gitignore-5087.md": {
	id: "npx-gitignore-5087.md";
  slug: "npx-gitignore-5087";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-community-manager-christina-gorton-4537.md": {
	id: "pairing-with-community-manager-christina-gorton-4537.md";
  slug: "pairing-with-community-manager-christina-gorton-4537";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-community-member-dan-ott-2ge.md": {
	id: "pairing-with-community-member-dan-ott-2ge.md";
  slug: "pairing-with-community-member-dan-ott-2ge";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-community-member-eliot-sanford-f7a.md": {
	id: "pairing-with-community-member-eliot-sanford-f7a.md";
  slug: "pairing-with-community-member-eliot-sanford-f7a";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-community-member-jono-yeong-3knk.md": {
	id: "pairing-with-community-member-jono-yeong-3knk.md";
  slug: "pairing-with-community-member-jono-yeong-3knk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-community-member-marie-antons-3doi.md": {
	id: "pairing-with-community-member-marie-antons-3doi.md";
  slug: "pairing-with-community-member-marie-antons-3doi";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-community-member-rachael-wright-munn-5bol.md": {
	id: "pairing-with-community-member-rachael-wright-munn-5bol.md";
  slug: "pairing-with-community-member-rachael-wright-munn-5bol";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-community-member-rafi-5169.md": {
	id: "pairing-with-community-member-rafi-5169.md";
  slug: "pairing-with-community-member-rafi-5169";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-community-member-seth-hall-1889.md": {
	id: "pairing-with-community-member-seth-hall-1889.md";
  slug: "pairing-with-community-member-seth-hall-1889";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-jhey-tompkins-2k85.md": {
	id: "pairing-with-jhey-tompkins-2k85.md";
  slug: "pairing-with-jhey-tompkins-2k85";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-meg-gutshall-28o7.md": {
	id: "pairing-with-meg-gutshall-28o7.md";
  slug: "pairing-with-meg-gutshall-28o7";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pairing-with-taniyah-jackson-on-a-forem-dev-issue-28fh.md": {
	id: "pairing-with-taniyah-jackson-on-a-forem-dev-issue-28fh.md";
  slug: "pairing-with-taniyah-jackson-on-a-forem-dev-issue-28fh";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"pock-an-awesome-utility-for-the-mac-touchbar-11ia.md": {
	id: "pock-an-awesome-utility-for-the-mac-touchbar-11ia.md";
  slug: "pock-an-awesome-utility-for-the-mac-touchbar-11ia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"probably-another-battleship-board-on-codepenio-coverimage-httpsc1staticflickrcom7609963333175677fc467e409ojpg--4n7m.md": {
	id: "probably-another-battleship-board-on-codepenio-coverimage-httpsc1staticflickrcom7609963333175677fc467e409ojpg--4n7m.md";
  slug: "probably-another-battleship-board-on-codepenio-coverimage-httpsc1staticflickrcom7609963333175677fc467e409ojpg--4n7m";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"productivity-tools-i-use-4gm3.md": {
	id: "productivity-tools-i-use-4gm3.md";
  slug: "productivity-tools-i-use-4gm3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"quick-fix-my-mcp-tools-were-showing-as-write-tools-in-chatgpt-dev-mode-3id9.md": {
	id: "quick-fix-my-mcp-tools-were-showing-as-write-tools-in-chatgpt-dev-mode-3id9.md";
  slug: "quick-fix-my-mcp-tools-were-showing-as-write-tools-in-chatgpt-dev-mode-3id9";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"quick-hulk-code-pen-18i1.md": {
	id: "quick-hulk-code-pen-18i1.md";
  slug: "quick-hulk-code-pen-18i1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"quick-simple-rating-code-pen-3ecp.md": {
	id: "quick-simple-rating-code-pen-3ecp.md";
  slug: "quick-simple-rating-code-pen-3ecp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"repurposing-content-for-content-creation-3l4d.md": {
	id: "repurposing-content-for-content-creation-3l4d.md";
  slug: "repurposing-content-for-content-creation-3l4d";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"review-fifine-ampligame-am6-condenser-mic-714.md": {
	id: "review-fifine-ampligame-am6-condenser-mic-714.md";
  slug: "review-fifine-ampligame-am6-condenser-mic-714";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"review-logitech-litra-glow-premium-led-streaming-light-with-truesoft-2p60.md": {
	id: "review-logitech-litra-glow-premium-led-streaming-light-with-truesoft-2p60.md";
  slug: "review-logitech-litra-glow-premium-led-streaming-light-with-truesoft-2p60";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"revue-being-phased-out-by-twitter-4kle.md": {
	id: "revue-being-phased-out-by-twitter-4kle.md";
  slug: "revue-being-phased-out-by-twitter-4kle";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"scoped-style--36n3.md": {
	id: "scoped-style--36n3.md";
  slug: "scoped-style--36n3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"see-the-big-picture-22bg.md": {
	id: "see-the-big-picture-22bg.md";
  slug: "see-the-big-picture-22bg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"set-sail-for-server-islands-how-they-work-and-when-to-use-them-1p76.md": {
	id: "set-sail-for-server-islands-how-they-work-and-when-to-use-them-1p76.md";
  slug: "set-sail-for-server-islands-how-they-work-and-when-to-use-them-1p76";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"setting-up-storybook-for-preact-p5a.md": {
	id: "setting-up-storybook-for-preact-p5a.md";
  slug: "setting-up-storybook-for-preact-p5a";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"showcase-your-gatsby-site-266.md": {
	id: "showcase-your-gatsby-site-266.md";
  slug: "showcase-your-gatsby-site-266";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"showcase-your-open-source-contributions-with-opensauced-dev-cards-2j0k.md": {
	id: "showcase-your-open-source-contributions-with-opensauced-dev-cards-2j0k.md";
  slug: "showcase-your-open-source-contributions-with-opensauced-dev-cards-2j0k";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"speech-to-text-with-deepgram-2b6i.md": {
	id: "speech-to-text-with-deepgram-2b6i.md";
  slug: "speech-to-text-with-deepgram-2b6i";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"storybook-talk-live-coding-klp.md": {
	id: "storybook-talk-live-coding-klp.md";
  slug: "storybook-talk-live-coding-klp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"strongly-typed-json-in-typescript-5gb2.md": {
	id: "strongly-typed-json-in-typescript-5gb2.md";
  slug: "strongly-typed-json-in-typescript-5gb2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"stuck-in-the-middle-with-you-an-intro-to-middleware-1gjo.md": {
	id: "stuck-in-the-middle-with-you-an-intro-to-middleware-1gjo.md";
  slug: "stuck-in-the-middle-with-you-an-intro-to-middleware-1gjo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"stuff-i-always-set-up-for-frontend-work-56h2.md": {
	id: "stuff-i-always-set-up-for-frontend-work-56h2.md";
  slug: "stuff-i-always-set-up-for-frontend-work-56h2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"supercharge-your-repository-with-code-owners-4clg.md": {
	id: "supercharge-your-repository-with-code-owners-4clg.md";
  slug: "supercharge-your-repository-with-code-owners-4clg";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"take-chances-and-standout-because-who-knows-3kh6.md": {
	id: "take-chances-and-standout-because-who-knows-3kh6.md";
  slug: "take-chances-and-standout-because-who-knows-3kh6";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"testing-preact-react-portals-with-testing-library-52ja.md": {
	id: "testing-preact-react-portals-with-testing-library-52ja.md";
  slug: "testing-preact-react-portals-with-testing-library-52ja";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"the-native-browser-dialog-element-1nhn.md": {
	id: "the-native-browser-dialog-element-1nhn.md";
  slug: "the-native-browser-dialog-element-1nhn";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"the-raycast-port-manager-extension-lca.md": {
	id: "the-raycast-port-manager-extension-lca.md";
  slug: "the-raycast-port-manager-extension-lca";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"the-react-useref-hook-not-just-for-html-elements-3cf3.md": {
	id: "the-react-useref-hook-not-just-for-html-elements-3cf3.md";
  slug: "the-react-useref-hook-not-just-for-html-elements-3cf3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"the-state-of-net-tooling-2024-169g.md": {
	id: "the-state-of-net-tooling-2024-169g.md";
  slug: "the-state-of-net-tooling-2024-169g";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"toast-messages-4hhd.md": {
	id: "toast-messages-4hhd.md";
  slug: "toast-messages-4hhd";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"tools-that-keep-me-productive-1no5.md": {
	id: "tools-that-keep-me-productive-1no5.md";
  slug: "tools-that-keep-me-productive-1no5";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"transform-your-portfolio-website-with-these-expert-tips-334e.md": {
	id: "transform-your-portfolio-website-with-these-expert-tips-334e.md";
  slug: "transform-your-portfolio-website-with-these-expert-tips-334e";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"twitter-charging-for-api-usage-starting-feb-9th-713.md": {
	id: "twitter-charging-for-api-usage-starting-feb-9th-713.md";
  slug: "twitter-charging-for-api-usage-starting-feb-9th-713";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"typescript-and-react-enforcing-props-for-accessibility-2h49.md": {
	id: "typescript-and-react-enforcing-props-for-accessibility-2h49.md";
  slug: "typescript-and-react-enforcing-props-for-accessibility-2h49";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"typescript-tips-part-i-4hhp.md": {
	id: "typescript-tips-part-i-4hhp.md";
  slug: "typescript-tips-part-i-4hhp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"typescript-tips-part-ii-declaration-merging-5gba.md": {
	id: "typescript-tips-part-ii-declaration-merging-5gba.md";
  slug: "typescript-tips-part-ii-declaration-merging-5gba";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"update-dependencies-with-dependabot-cypress-and-netlify-3lkf.md": {
	id: "update-dependencies-with-dependabot-cypress-and-netlify-3lkf.md";
  slug: "update-dependencies-with-dependabot-cypress-and-netlify-3lkf";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"using-a-hook-in-a-class-component-3eh2.md": {
	id: "using-a-hook-in-a-class-component-3eh2.md";
  slug: "using-a-hook-in-a-class-component-3eh2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"valibot-a-new-approach-to-data-validation-in-javascript-1mgb.md": {
	id: "valibot-a-new-approach-to-data-validation-in-javascript-1mgb.md";
  slug: "valibot-a-new-approach-to-data-validation-in-javascript-1mgb";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"what-are-ai-evals-1kk9.md": {
	id: "what-are-ai-evals-1kk9.md";
  slug: "what-are-ai-evals-1kk9";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"what-is-deno-13he.md": {
	id: "what-is-deno-13he.md";
  slug: "what-is-deno-13he";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"what-is-genaiscript-1mf2.md": {
	id: "what-is-genaiscript-1mf2.md";
  slug: "what-is-genaiscript-1mf2";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"what-is-the-collab-lab-427f.md": {
	id: "what-is-the-collab-lab-427f.md";
  slug: "what-is-the-collab-lab-427f";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"what-is-zero-trust-4ob9.md": {
	id: "what-is-zero-trust-4ob9.md";
  slug: "what-is-zero-trust-4ob9";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"what-makes-goose-different-from-other-ai-coding-agents-2edc.md": {
	id: "what-makes-goose-different-from-other-ai-coding-agents-2edc.md";
  slug: "what-makes-goose-different-from-other-ai-coding-agents-2edc";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"where-do-you-find-community-458p.md": {
	id: "where-do-you-find-community-458p.md";
  slug: "where-do-you-find-community-458p";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"why-you-might-want-to-consider-using-typescript-6j3.md": {
	id: "why-you-might-want-to-consider-using-typescript-6j3.md";
  slug: "why-you-might-want-to-consider-using-typescript-6j3";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"you-do-no-need-to-use-the-classnames-package-1bb.md": {
	id: "you-do-no-need-to-use-the-classnames-package-1bb.md";
  slug: "you-do-no-need-to-use-the-classnames-package-1bb";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
