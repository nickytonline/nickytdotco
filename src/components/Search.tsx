import React, { useEffect, useRef, useState } from "react";
import { Search as SearchIcon } from "lucide-react";

interface PagefindResult {
  url: string;
  excerpt: string;
  meta: {
    title: string;
  };
}

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResult[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const performSearch = async () => {
      if (!query || !pagefind.current) {
        setResults([]);
        return;
      }

      try {
        const search = await pagefind.current.search(query);
        if (search.results) {
          const res = await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            search.results.slice(0, 5).map((r: any) => r.data())
          );
          setResults(res);
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
          {results.length > 0 ? (
            <ul className="space-y-2">
              {results.map((result) => (
                <li key={result.url}>
                  <a
                    href={result.url}
                    className="block p-4 rounded-lg hover:bg-secondary group transition-colors border border-transparent hover:border-secondary"
                  >
                    <h3 className="font-bold text-lg group-hover:text-pink-600 transition-colors">
                      {result.meta.title}
                    </h3>
                    <p
                      className="text-sm text-muted-foreground line-clamp-2 mt-1"
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </a>
                </li>
              ))}
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
                `No results found for "${query}"`
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              Type to start searching...
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default Search;
