import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { searchSite, type SearchResult } from "../lib/search/searchSite";
import {
  SEARCH_ARIA_KEYSHORTCUTS,
  SEARCH_DEBOUNCE_MS,
  SEARCH_MAX_QUERY_CHARS,
  SEARCH_MIN_QUERY_CHARS,
} from "../lib/search/constants";
import { registerSearchSiteTool } from "../lib/webmcp/searchSiteTool";

const SEARCH_PLACEHOLDER = "Search posts, talks, projects...";

type SearchErrorKind = "rate-limit" | "unavailable";

const SEARCH_ERROR_MESSAGE: Record<SearchErrorKind, string> = {
  "rate-limit": "Too many searches. Wait a moment and try again.",
  unavailable: "Search is temporarily unavailable. Try again.",
};

const SEARCH_ERROR_STATUS: Record<SearchErrorKind, string> = {
  "rate-limit": "Too many searches",
  unavailable: "Search is temporarily unavailable",
};

const Search = () => {
  const searchId = useId().replaceAll(":", "");
  const resultsListId = `${searchId}-results`;
  const optionId = (index: number) => `${searchId}-result-${index}`;
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<SearchErrorKind | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const closeSearch = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsSearching(false);
    setSelectedIndex(-1);
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isOpen) {
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        ) {
          return;
        }
        e.preventDefault();
        setIsOpen(true);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const handleNavigation = () => {
      closeSearch();
    };

    document.addEventListener("astro:before-preparation", handleNavigation);
    return () => {
      document.removeEventListener(
        "astro:before-preparation",
        handleNavigation
      );
    };
  }, [closeSearch]);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const inset = 12;
    const maxHeightPx = 36 * 16;

    const syncToVisualViewport = () => {
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const offsetTop = viewport?.offsetTop ?? 0;
      const available = Math.max(0, height - inset * 2);
      dialog.style.top = `${offsetTop + inset}px`;
      dialog.style.height = `${Math.min(available, maxHeightPx)}px`;
      dialog.style.maxHeight = `${available}px`;
    };

    syncToVisualViewport();
    window.visualViewport?.addEventListener("resize", syncToVisualViewport);
    window.visualViewport?.addEventListener("scroll", syncToVisualViewport);
    window.addEventListener("resize", syncToVisualViewport);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        syncToVisualViewport
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        syncToVisualViewport
      );
      window.removeEventListener("resize", syncToVisualViewport);
      dialog.style.top = "";
      dialog.style.height = "";
      dialog.style.maxHeight = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeSearch();
    }
  };

  const openSelectedResult = () => {
    const selected = results[selectedIndex];
    if (selected) {
      window.location.href = selected.url;
    }
  };

  const performSearch = useCallback(async (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (trimmed.length < SEARCH_MIN_QUERY_CHARS) {
      setResults([]);
      setSubmittedQuery("");
      setSearchError(null);
      setSelectedIndex(-1);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsSearching(true);
    setSearchError(null);
    setSubmittedQuery(trimmed);
    setResults([]);
    setSelectedIndex(-1);

    try {
      const response = await searchSite(trimmed, undefined, controller.signal);
      setResults(response.results);
      setSelectedIndex(response.results.length > 0 ? 0 : -1);
    } catch (error) {
      if (
        (error instanceof DOMException && error.name === "AbortError") ||
        (error instanceof Error && error.name === "AbortError")
      ) {
        return;
      }
      console.error("Search failed", error);
      setResults([]);
      setSelectedIndex(-1);
      const statusCode = (error as { status?: number }).status;
      setSearchError(statusCode === 429 ? "rate-limit" : "unavailable");
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  }, []);

  useEffect(() => {
    const registration = new AbortController();

    void registerSearchSiteTool({ signal: registration.signal }).catch(
      (error) => {
        console.error("WebMCP search tool registration failed", error);
      }
    );

    return () => {
      registration.abort();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trimmed = query.trim();
    if (trimmed.length < SEARCH_MIN_QUERY_CHARS) {
      return;
    }

    if (trimmed === submittedQuery) {
      return;
    }

    const debounce = setTimeout(() => {
      void performSearch(trimmed);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(debounce);
    };
  }, [isOpen, query, submittedQuery, performSearch]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextQuery = e.target.value;
    setQuery(nextQuery);

    if (nextQuery.trim().length >= SEARCH_MIN_QUERY_CHARS) {
      return;
    }

    abortRef.current?.abort();
    abortRef.current = null;
    setResults([]);
    setSubmittedQuery("");
    setSearchError(null);
    setSelectedIndex(-1);
    setIsSearching(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedInput = query.trim();
    if (
      selectedIndex >= 0 &&
      results.length > 0 &&
      !isSearching &&
      normalizedInput === submittedQuery
    ) {
      openSelectedResult();
      return;
    }
    void performSearch(query);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      // type="search" would otherwise consume the first Escape to clear the
      // field, leaving the dialog open until a second Escape.
      e.preventDefault();
      closeSearch();
      return;
    }

    if (
      results.length === 0 ||
      isSearching ||
      query.trim() !== submittedQuery
    ) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  const trimmedQuery = query.trim();
  const hasTypedEnough = trimmedQuery.length >= SEARCH_MIN_QUERY_CHARS;
  const isPendingSearch =
    hasTypedEnough && trimmedQuery !== submittedQuery && !isSearching;
  const showSearching = hasTypedEnough && (isSearching || isPendingSearch);
  // Drop stale hits as soon as Searching… is shown for a new query.
  const showResults = results.length > 0 && hasTypedEnough && !showSearching;
  const activeOptionId =
    showResults && selectedIndex >= 0 ? optionId(selectedIndex) : undefined;
  const resultCountLabel =
    results.length === 1 ? "1 result found" : `${results.length} results found`;
  const paneStatus = searchError
    ? SEARCH_ERROR_STATUS[searchError]
    : showSearching
      ? "Searching…"
      : showResults
        ? resultCountLabel
        : hasTypedEnough &&
            trimmedQuery === submittedQuery &&
            results.length === 0
          ? "No results"
          : "\u00a0";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex hover:text-brand focus:text-brand focus:outline-none transition-colors"
        aria-label="Search site"
        aria-keyshortcuts={SEARCH_ARIA_KEYSHORTCUTS}
      >
        <SearchIcon className="w-4.5 h-4.5 lg:w-5 lg:h-5" strokeWidth={3} />
        <span className="sr-only">Search</span>
      </button>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialogRef}
        onClose={closeSearch}
        onClick={handleBackdropClick}
        aria-labelledby="search-dialog-title"
        className="fixed left-1/2 top-3 m-0 h-[min(70dvh,36rem)] max-h-[calc(100dvh-1.5rem)] w-[90vw] max-w-2xl -translate-x-1/2 open:flex open:flex-col overflow-hidden rounded-xl border border-secondary bg-background p-0 text-foreground shadow-2xl outline-none backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-secondary p-4">
          <h2 id="search-dialog-title" className="sr-only">
            Search site
          </h2>
          <form className="relative min-w-0 flex-1" onSubmit={handleSubmit}>
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="search"
              name="q"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showResults}
              aria-controls={showResults ? resultsListId : undefined}
              aria-activedescendant={activeOptionId}
              maxLength={SEARCH_MAX_QUERY_CHARS}
              autoComplete="off"
              aria-label="Search posts, talks, and projects"
              placeholder={SEARCH_PLACEHOLDER}
              className="w-full pl-10 pr-4 py-3 bg-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-lg"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleInputKeyDown}
            />
            <button type="submit" className="sr-only">
              Search
            </button>
          </form>
          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:bg-secondary focus-visible:text-foreground focus:outline-none"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto p-4"
          aria-busy={showSearching}
        >
          <div className="mb-4 h-6 px-2 text-sm text-muted-foreground">
            <span
              aria-live="polite"
              aria-atomic="true"
              aria-hidden={searchError ? true : undefined}
            >
              {paneStatus}
            </span>
          </div>

          <div
            role="alert"
            className={
              searchError
                ? "flex min-h-[16rem] items-center justify-center text-center"
                : "sr-only"
            }
          >
            {searchError ? (
              <div className="space-y-2">
                <p className="text-lg text-destructive">
                  {SEARCH_ERROR_MESSAGE[searchError]}
                </p>
                <p className="text-sm text-muted-foreground">
                  Try searching again in a moment.
                </p>
              </div>
            ) : null}
          </div>

          {searchError ? null : showResults ? (
            /* Native select/option cannot host remote results, links, or
               aria-activedescendant while focus stays in the combobox input. */
            /* eslint-disable jsx-a11y/prefer-tag-over-role -- combobox listbox */
            <div
              ref={resultsRef}
              id={resultsListId}
              role="listbox"
              aria-label="Search results"
              className="space-y-2"
            >
              {results.map((result, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <a
                    key={result.url}
                    id={optionId(index)}
                    href={result.url}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={-1}
                    aria-label={`${result.title} (${result.type})`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`block rounded-lg border p-4 outline-none transition-colors ${
                      isSelected
                        ? "border-brand/30 bg-secondary ring-1 ring-brand/20 dark:border-brand/30 dark:ring-brand/20"
                        : "border-transparent hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-lg font-bold transition-colors ${
                            isSelected ? "text-brand" : ""
                          }`}
                        >
                          {result.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {result.excerpt}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-secondary bg-muted px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {result.type}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : /* eslint-enable jsx-a11y/prefer-tag-over-role */
          showSearching ? (
            <div
              className="flex min-h-[16rem] items-center justify-center text-muted-foreground"
              aria-hidden="true"
            >
              <Loader2 className="h-8 w-8 animate-spin opacity-50" />
            </div>
          ) : hasTypedEnough &&
            trimmedQuery === submittedQuery &&
            results.length === 0 ? (
            <div className="flex min-h-[16rem] items-center justify-center text-center text-muted-foreground">
              <div className="space-y-2">
                <p className="text-lg">No results found for "{query}"</p>
                <p className="text-sm">Try searching for something else.</p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[16rem] flex-col items-center justify-center space-y-4 text-muted-foreground">
              <div className="rounded-full bg-secondary p-4">
                <SearchIcon className="h-8 w-8 opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Search the site</p>
                <p className="text-sm">
                  Type at least two characters to search blog posts, talks, and
                  livestreams.
                </p>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default Search;
