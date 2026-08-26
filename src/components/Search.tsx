import React, { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { searchSite, type SearchResult } from "../lib/search/searchSite";

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !isOpen) {
        // Only trigger if no input is focused
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
      } else if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
          e.preventDefault();
          const selected = results[selectedIndex];
          if (selected) {
            window.location.href = selected.url;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    const handleNavigation = () => {
      setIsOpen(false);
    };

    document.addEventListener("astro:before-preparation", handleNavigation);
    return () => {
      document.removeEventListener("astro:before-preparation", handleNavigation);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
      setSelectedIndex(-1);
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Scroll active result into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      setSearchError(null);
      setSelectedIndex(-1);
      return () => controller.abort();
    }

    setIsSearching(true);
    setSearchError(null);

    const performSearch = async () => {
      try {
        const response = await searchSite(query, undefined, controller.signal);
        setResults(response.results);
        setSelectedIndex(response.results.length > 0 ? 0 : -1);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Search failed", error);
        setResults([]);
        setSelectedIndex(-1);
        setSearchError("Search is temporarily unavailable. Try again.");
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [query]);

  const resultCountLabel =
    results.length === 1 ? "1 result found" : `${results.length} results found`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex hover:text-brand focus:text-brand focus:outline-none transition-colors"
        aria-label="Search site"
      >
        <SearchIcon className="w-4.5 h-4.5 lg:w-5 lg:h-5" strokeWidth={3} />
        <span className="sr-only">Search</span>
      </button>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialogRef}
        onClose={() => setIsOpen(false)}
        onClick={handleBackdropClick}
        aria-labelledby="search-dialog-title"
        className="fixed inset-0 m-auto backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-background text-foreground p-0 rounded-xl shadow-2xl w-[90vw] max-w-2xl border border-secondary transition-all outline-none overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 p-4 border-b border-secondary">
          <h2 id="search-dialog-title" className="sr-only">
            Search site
          </h2>
          <div className="relative min-w-0 flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              aria-label="Search posts, talks, and projects"
              placeholder="Search posts, talks, projects... (shortcut: /)"
              className="w-full pl-10 pr-4 py-3 bg-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-brand text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setIsOpen(false)}
            className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:bg-secondary focus-visible:text-foreground focus:outline-none"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {results.length > 0 && (
            <div className="flex justify-between items-baseline mb-4 px-2 text-sm text-muted-foreground">
              <span>{resultCountLabel}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 border border-secondary rounded bg-muted font-sans text-xs">
                ESC to close
              </kbd>
            </div>
          )}

          {searchError ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-lg text-destructive">{searchError}</p>
              <p className="text-sm text-muted-foreground">Try searching again in a moment.</p>
            </div>
          ) : results.length > 0 ? (
            <ul ref={resultsRef} className="space-y-2">
              {results.map((result, index) => {
                const isSelected = index === selectedIndex;

                return (
                  <li key={result.url}>
                    <a
                      href={result.url}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`block p-4 rounded-lg transition-colors border outline-none ${
                        isSelected
                          ? "bg-secondary border-brand/30 dark:border-brand/30 ring-1 ring-brand/20 dark:ring-brand/20"
                          : "hover:bg-secondary border-transparent"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`font-bold text-lg transition-colors ${
                              isSelected
                                ? "text-brand"
                                : "group-hover:text-brand group-focus:text-brand"
                            }`}
                          >
                            {result.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {result.excerpt}
                          </p>
                        </div>
                        <span className="shrink-0 text-[10px] uppercase tracking-wider font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground border border-secondary">
                          {result.type}
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : query.trim() && isSearching ? (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg">Searching…</p>
            </div>
          ) : query.trim() ? (
            <div className="text-center text-muted-foreground py-12 space-y-2">
              <p className="text-lg">No results found for "{query}"</p>
              <p className="text-sm">Try searching for something else.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-4">
              <div className="p-4 bg-secondary rounded-full">
                <SearchIcon className="w-8 h-8 opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Search the site</p>
                <p className="text-sm">Search for blog posts, talks, livestreams, and more</p>
              </div>
              <div className="flex gap-4 pt-4 text-xs">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted border border-secondary rounded">
                    &uarr;&darr;
                  </kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted border border-secondary rounded">Enter</kbd>
                  Open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted border border-secondary rounded">ESC</kbd>
                  Close
                </span>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default Search;
