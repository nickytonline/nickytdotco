import React, { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

interface PagefindResult {
  url: string;
  excerpt: string;
  meta: {
    title: string;
    image?: string;
  };
  filters?: {
    type?: string[];
  };
}

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pagefind = useRef<any>(null);

  useEffect(() => {
    const initPagefind = async () => {
      if (import.meta.env.DEV) {
        console.warn("Pagefind is not available in dev mode.");
        return;
      }

      try {
        const pagefindPath = "/pagefind/pagefind.js";
        // Using @vite-ignore to prevent Vite from resolving at build time
        pagefind.current = await import(/* @vite-ignore */ pagefindPath);
        if (pagefind.current && typeof pagefind.current.init === "function") {
          await pagefind.current.init();
        }
      } catch (e) {
        console.error("Failed to load pagefind", e);
      }
    };

    initPagefind();
  }, []);

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
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
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
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const performSearch = async () => {
      if (!query || !pagefind.current) {
        setResults([]);
        setTotalResults(0);
        setSelectedIndex(-1);
        return;
      }

      try {
        const search = await pagefind.current.search(query);
        if (search.results) {
          setTotalResults(search.results.length);
          const res = await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            search.results.slice(0, 8).map((r: any) => r.data())
          );
          setResults(res);
          setSelectedIndex(res.length > 0 ? 0 : -1);
        }
      } catch (e) {
        console.error("Search failed", e);
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex hover:text-pink-600 hover:dark:text-pink-400 focus:text-pink-600 focus:dark:text-pink-400 focus:outline-none transition-colors"
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
        className="fixed inset-0 m-auto backdrop:bg-black/60 backdrop:backdrop-blur-sm bg-background text-foreground p-0 rounded-xl shadow-2xl w-[90vw] max-w-2xl border border-secondary transition-all outline-none overflow-hidden"
      >
        <div className="p-4 border-b border-secondary">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search posts, talks, projects... (shortcut: /)"
              className="w-full pl-10 pr-4 py-3 bg-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-pink-600 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {import.meta.env.DEV && (
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 p-4 rounded-md mb-4 text-center text-sm border border-amber-200 dark:border-amber-800">
              Note: Search results are only available after a production build.
            </div>
          )}

          {results.length > 0 && (
            <div className="flex justify-between items-baseline mb-4 px-2 text-sm text-muted-foreground">
              <span>{totalResults} results found</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 border border-secondary rounded bg-muted font-sans text-xs">
                ESC to close
              </kbd>
            </div>
          )}

          {results.length > 0 ? (
            <ul ref={resultsRef} className="space-y-2">
              {results.map((result, index) => {
                const isSelected = index === selectedIndex;
                const type = result.filters?.type?.[0];

                return (
                  <li key={result.url}>
                    <a
                      href={result.url}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`block p-4 rounded-lg transition-colors border outline-none ${
                        isSelected
                          ? "bg-secondary border-pink-600/30 dark:border-pink-400/30 ring-1 ring-pink-600/20 dark:ring-pink-400/20"
                          : "hover:bg-secondary border-transparent"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`font-bold text-lg transition-colors ${
                              isSelected
                                ? "text-pink-600 dark:text-pink-400"
                                : "group-hover:text-pink-600 group-focus:text-pink-600"
                            }`}
                          >
                            {result.meta.title}
                          </h3>
                          <p
                            className="text-sm text-muted-foreground line-clamp-2 mt-1"
                            dangerouslySetInnerHTML={{ __html: result.excerpt }}
                          />
                        </div>
                        {type && (
                          <span className="shrink-0 text-[10px] uppercase tracking-wider font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground border border-secondary">
                            {type}
                          </span>
                        )}
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : query ? (
            <div className="text-center text-muted-foreground py-12">
              {import.meta.env.DEV ? (
                <div className="space-y-4">
                  <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                    Search is unavailable in development
                  </p>
                  <p className="text-sm max-w-md mx-auto">
                    Pagefind indexes your site during the production build. To
                    test search locally, run:
                    <code className="block mt-2 p-2 bg-secondary rounded text-foreground">
                      npm run build && npm run preview
                    </code>
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg">No results found for "{query}"</p>
                  <p className="text-sm">Try searching for something else.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-4">
              <div className="p-4 bg-secondary rounded-full">
                <SearchIcon className="w-8 h-8 opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Search the site</p>
                <p className="text-sm">
                  Search for blog posts, talks, projects, and more
                </p>
              </div>
              <div className="flex gap-4 pt-4 text-xs">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted border border-secondary rounded">
                    &uarr;&darr;
                  </kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted border border-secondary rounded">
                    Enter
                  </kbd>
                  Open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-muted border border-secondary rounded">
                    ESC
                  </kbd>
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
