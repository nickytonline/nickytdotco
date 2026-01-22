import { useState } from "react";
import type { CollectionEntry } from "astro:content";
import { seriesName, truncate } from "../utils/filters";
import slugify from "slugify";

interface Props {
  series: {
    name: string;
    collection_id: number;
  };
  currentUrl: string;
  posts: CollectionEntry<"blog">[];
}

export default function SeriesNavigation({ series, currentUrl, posts }: Props) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const sortedPosts = posts.sort(
    (a, b) => a.data.date.getTime() - b.data.date.getTime()
  );

  if (sortedPosts.length <= 1) {
    return null;
  }

  const currentIndex = sortedPosts.findIndex(
    (post) => `/blog/${post.slug}` === currentUrl
  );
  const totalPosts = sortedPosts.length;
  const hasCollapse = totalPosts > 5;

  const isFirst = currentIndex === 0;
  const isSecond = currentIndex === 1;
  const isSecondToLast = currentIndex === totalPosts - 2;
  const isLast = currentIndex === totalPosts - 1;

  function shouldShowItem(index: number): boolean {
    if (!hasCollapse) return true;

    if (isFirst || isSecond) {
      return (
        index === 0 || index === 1 || index === 2 || index === totalPosts - 1
      );
    } else if (isSecondToLast || isLast) {
      return (
        index === 0 ||
        index === totalPosts - 3 ||
        index === totalPosts - 2 ||
        index === totalPosts - 1
      );
    } else {
      return index === 0 || index === currentIndex || index === totalPosts - 1;
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const seriesSlug = slugify(seriesName(series), { lower: true, strict: true });

  const renderEllipsisBefore = (_i: number) => {
    let hiddenCount = 0;
    const hiddenStart = 1;
    let hiddenEnd = currentIndex;

    if (isSecondToLast || isLast) {
      hiddenCount = totalPosts - 4;
      hiddenEnd = totalPosts - 3;
    } else {
      hiddenCount = currentIndex - 1;
    }

    const isExpanded = expandedSections["before"];

    if (hiddenCount === 1) {
      const hiddenPost =
        sortedPosts[isSecondToLast || isLast ? 1 : currentIndex - 1];
      const hiddenIndex = isSecondToLast || isLast ? 1 : currentIndex - 1;
      return (
        <li className="flex items-start gap-2">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-semibold leading-none text-gray-700 dark:text-gray-300"
            aria-hidden="true"
          >
            {hiddenIndex + 1}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <a
              href={`/blog/${hiddenPost.slug}`}
              className="block text-sm leading-tight text-gray-700 dark:text-gray-300 no-underline hover:text-pink-600 dark:hover:text-pink-400 hover:underline focus-visible:text-pink-600 dark:focus-visible:text-pink-400 focus-visible:underline focus-visible:outline-none"
            >
              {truncate(hiddenPost.data.title, 80)}
            </a>
          </div>
        </li>
      );
    }

    return (
      <>
        <li className="flex items-center gap-2">
          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-transparent p-0 text-base tracking-tight text-gray-500 dark:text-gray-400"
            aria-hidden="true"
          >
            ···
          </span>
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-left text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 focus-visible:text-pink-600 dark:focus-visible:text-pink-400 focus-visible:outline-none"
            aria-expanded={isExpanded}
            onClick={() => toggleSection("before")}
          >
            {isExpanded ? "Show less" : `${hiddenCount} more parts…`}
          </button>
        </li>
        {isExpanded &&
          sortedPosts.slice(hiddenStart, hiddenEnd).map((hiddenPost, idx) => (
            <li key={hiddenPost.slug} className="flex items-start gap-2">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-semibold leading-none text-gray-700 dark:text-gray-300"
                aria-hidden="true"
              >
                {hiddenStart + idx + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <a
                  href={`/blog/${hiddenPost.slug}`}
                  className="block text-sm leading-tight text-gray-700 dark:text-gray-300 no-underline hover:text-pink-600 dark:hover:text-pink-400 hover:underline focus-visible:text-pink-600 dark:focus-visible:text-pink-400 focus-visible:text-pink-600 dark:focus-visible:text-pink-400 focus-visible:underline focus-visible:outline-none"
                >
                  {truncate(hiddenPost.data.title, 80)}
                </a>
              </div>
            </li>
          ))}
      </>
    );
  };

  const renderEllipsisAfter = (_i: number) => {
    let hiddenCount = 0;
    let hiddenStart = currentIndex + 1;
    const hiddenEnd = totalPosts - 1;

    if (isFirst || isSecond) {
      hiddenCount = totalPosts - 4;
      hiddenStart = 3;
    } else {
      hiddenCount = totalPosts - currentIndex - 2;
    }

    const isExpanded = expandedSections["after"];

    if (hiddenCount === 1) {
      const hiddenPost =
        sortedPosts[isFirst || isSecond ? 3 : currentIndex + 1];
      const hiddenIndex = isFirst || isSecond ? 3 : currentIndex + 1;
      return (
        <li className="flex items-start gap-4">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-semibold leading-none text-gray-700 dark:text-gray-300"
            aria-hidden="true"
          >
            {hiddenIndex + 1}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <a
              href={`/blog/${hiddenPost.slug}`}
              className="block text-sm leading-tight text-gray-700 dark:text-gray-300 no-underline hover:text-pink-600 dark:hover:text-pink-400 hover:underline focus-visible:text-pink-600 dark:focus-visible:text-pink-400 focus-visible:text-pink-600 dark:focus-visible:text-pink-400 focus-visible:underline focus-visible:outline-none"
            >
              {truncate(hiddenPost.data.title, 80)}
            </a>
          </div>
        </li>
      );
    }

    return (
      <>
        <li className="flex items-center gap-2">
          <span
            className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-transparent p-0 text-base tracking-tight text-gray-500 dark:text-gray-400"
            aria-hidden="true"
          >
            ···
          </span>
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-left text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:underline focus-visible:text-pink-600 dark:focus-visible:text-pink-400 focus-visible:underline focus-visible:outline-none"
            aria-expanded={isExpanded}
            onClick={() => toggleSection("after")}
          >
            {isExpanded ? "Show less" : `${hiddenCount} more parts…`}
          </button>
        </li>
        {isExpanded &&
          sortedPosts.slice(hiddenStart, hiddenEnd).map((hiddenPost, idx) => (
            <li key={hiddenPost.slug} className="flex items-start gap-4">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-semibold leading-none text-gray-700 dark:text-gray-300"
                aria-hidden="true"
              >
                {hiddenStart + idx + 1}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <a
                  href={`/blog/${hiddenPost.slug}`}
                  className="block text-sm leading-tight text-gray-700 dark:text-gray-300 no-underline hover:text-pink-600 dark:hover:text-pink-400 hover:underline focus-visible:text-pink-600 dark:focus-visible:text-pink-400 focus-visible:text-pink-600 dark:focus-visible:text-pink-400 focus-visible:underline focus-visible:outline-none"
                >
                  {truncate(hiddenPost.data.title, 80)}
                </a>
              </div>
            </li>
          ))}
      </>
    );
  };

  return (
    <aside className="my-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <nav aria-label="Series navigation" role="navigation">
        <h2 className="mb-4">{seriesName(series)}</h2>

        <ol
          id={`series-list-${seriesSlug}`}
          className="m-0 flex list-none flex-col gap-4 p-0"
        >
          {sortedPosts.map((post, i) => {
            const isCurrent = i === currentIndex;
            const shouldShow = shouldShowItem(i);

            let showEllipsisBefore = false;
            let showEllipsisAfter = false;

            if (hasCollapse) {
              if ((isSecondToLast || isLast) && i === 1) {
                showEllipsisBefore = true;
              } else if (
                !isFirst &&
                !isSecond &&
                !isSecondToLast &&
                !isLast &&
                i === 1
              ) {
                showEllipsisBefore = true;
              }

              if ((isFirst || isSecond) && i === 3) {
                showEllipsisAfter = true;
              } else if (
                !isFirst &&
                !isSecond &&
                !isSecondToLast &&
                !isLast &&
                i === currentIndex + 1
              ) {
                showEllipsisAfter = true;
              }
            }

            return (
              <div key={post.slug} className="contents">
                {showEllipsisBefore && renderEllipsisBefore(i)}

                {shouldShow && (
                  <li className="flex items-start gap-2">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold leading-none ${
                        isCurrent
                          ? "bg-pink-600 dark:bg-pink-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      {isCurrent ? (
                        <>
                          <span className="block text-sm leading-tight font-semibold text-pink-600 dark:text-pink-400">
                            {post.data.title}
                          </span>
                          <span className="sr-only">(current post)</span>
                        </>
                      ) : (
                        <a
                          href={`/blog/${post.slug}`}
                          className="block text-sm leading-tight text-gray-700 dark:text-gray-300 no-underline hover:text-pink-600 dark:hover:text-pink-400 hover:underline focus-visible:text-pink-600 dark:focus-visible:text-pink-400 focus-visible:underline focus-visible:outline-none"
                        >
                          {truncate(post.data.title, 80)}
                        </a>
                      )}
                    </div>
                  </li>
                )}

                {showEllipsisAfter && renderEllipsisAfter(i)}
              </div>
            );
          })}
        </ol>
      </nav>
    </aside>
  );
}
