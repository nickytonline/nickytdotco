/**
 * BlogSearch - Client-side search functionality with FlexSearch
 * Lazy loads search index, caches with localStorage, performs real-time searches
 */

/**
 * BlogSearch class for handling blog post searches
 * @class
 */
class BlogSearch {
  /**
   * Create a new BlogSearch instance
   * @param {Object} options - Configuration options
   * @param {string} options.inputSelector - CSS selector for search input element
   * @param {string} options.resultsSelector - CSS selector for results container
   * @param {string} options.indexUrl - URL to search-index.json file
   * @param {number} options.debounceDelay - Debounce delay in ms (default: 300)
   */
  constructor(options = {}) {
    this.inputSelector = options.inputSelector || "[data-search-input]";
    this.resultsSelector = options.resultsSelector || "[data-search-results]";
    this.indexUrl = options.indexUrl || "/search-index.json";
    this.debounceDelay = options.debounceDelay || 300;

    this.inputElement = null;
    this.resultsElement = null;
    this.searchIndex = null;
    this.indexData = null;
    this.isLoading = false;
    this.isInitialized = false;
    this.debounceTimer = null;
    this.cacheVersion = "search-index-v1";

    this.init();
  }

  /**
   * Initialize search functionality
   */
  init() {
    this.inputElement = document.querySelector(this.inputSelector);
    this.resultsElement = document.querySelector(this.resultsSelector);

    if (!this.inputElement || !this.resultsElement) {
      console.warn("BlogSearch: Required elements not found");
      return;
    }

    // Lazy load on focus or hover
    this.inputElement.addEventListener("focus", () => this.ensureIndexLoaded());
    this.inputElement.addEventListener("mouseover", () => this.ensureIndexLoaded());

    // Real-time search on input
    this.inputElement.addEventListener("input", (e) => this.handleSearch(e));
  }

  /**
   * Ensure search index is loaded (lazy loading)
   */
  async ensureIndexLoaded() {
    if (this.isInitialized || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.showLoadingState();

    try {
      await this.loadIndex();
      await this.initializeFlexSearch();
      this.isInitialized = true;
      this.clearLoadingState();

      // If there's already text, perform search
      if (this.inputElement.value.trim()) {
        this.performSearch(this.inputElement.value);
      }
    } catch (error) {
      console.error("BlogSearch: Failed to load index", error);
      this.showErrorState(
        "Search unavailable. Please try again later."
      );
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load search index from JSON file or cache
   */
  async loadIndex() {
    // Try to load from localStorage cache
    const cached = this.getCachedIndex();
    if (cached) {
      this.indexData = cached;
      return;
    }

    // Fetch from server
    const response = await fetch(this.indexUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch search index: ${response.statusText}`);
    }

    this.indexData = await response.json();

    // Validate structure
    if (!this.indexData.meta || !Array.isArray(this.indexData.posts)) {
      throw new Error("Invalid search index structure");
    }

    // Cache the index
    this.cacheIndex(this.indexData);
  }

  /**
   * Get cached index from localStorage
   * @returns {Object|null} Cached index data or null if not found/invalid
   */
  getCachedIndex() {
    try {
      const cached = localStorage.getItem(this.cacheVersion);
      if (!cached) {
        return null;
      }

      const data = JSON.parse(cached);

      // Validate cache hasn't expired or been invalidated
      if (!data.meta || !Array.isArray(data.posts)) {
        localStorage.removeItem(this.cacheVersion);
        return null;
      }

      return data;
    } catch (error) {
      console.warn("BlogSearch: Cache read error", error);
      localStorage.removeItem(this.cacheVersion);
      return null;
    }
  }

  /**
   * Cache index data in localStorage
   * @param {Object} data - Index data to cache
   */
  cacheIndex(data) {
    try {
      localStorage.setItem(this.cacheVersion, JSON.stringify(data));
    } catch (error) {
      console.warn("BlogSearch: Cache write error", error);
      // Gracefully continue without caching
    }
  }

  /**
   * Initialize FlexSearch with index data
   */
  async initializeFlexSearch() {
    // Load FlexSearch from CDN
    if (typeof FlexSearch === "undefined") {
      await this.loadFlexSearchLibrary();
    }

    // Create FlexSearch index
    this.searchIndex = new FlexSearch.Index({
      tokenize: "forward",
      encode: "icase",
      optimize: true,
      resolution: 9,
      minlength: 2
    });

    // Add posts to index
    this.indexData.posts.forEach((post) => {
      this.searchIndex.add(
        post.id,
        `${post.title} ${post.excerpt || ""} ${post.tags ? post.tags.join(" ") : ""}`
      );
    });
  }

  /**
   * Load FlexSearch library from CDN
   */
  loadFlexSearchLibrary() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/flexsearch@0.7.43/dist/flexsearch.bundle.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = () =>
        reject(new Error("Failed to load FlexSearch library"));
      document.head.appendChild(script);
    });
  }

  /**
   * Handle search input with debouncing
   * @param {Event} e - Input event
   */
  handleSearch(e) {
    const query = e.target.value.trim();

    // Clear previous timer
    clearTimeout(this.debounceTimer);

    // Ensure index is loaded first
    if (!this.isInitialized) {
      this.ensureIndexLoaded().then(() => {
        if (query) {
          this.debounceTimer = setTimeout(
            () => this.performSearch(query),
            this.debounceDelay
          );
        }
      });
      return;
    }

    // Debounce search
    if (query) {
      this.debounceTimer = setTimeout(
        () => this.performSearch(query),
        this.debounceDelay
      );
    } else {
      this.clearResults();
    }
  }

  /**
   * Perform search query
   * @param {string} query - Search query string
   */
  performSearch(query) {
    if (!this.searchIndex || !query) {
      this.clearResults();
      return;
    }

    try {
      // Search with FlexSearch
      const resultIds = this.searchIndex.search(query, {
        limit: 10,
        suggest: true
      });

      // Build result objects
      const results = resultIds
        .map((id) => this.indexData.posts.find((post) => post.id === id))
        .filter(Boolean);

      this.displayResults(results, query);
    } catch (error) {
      console.error("BlogSearch: Search error", error);
      this.showErrorState("Search error. Please try again.");
    }
  }

  /**
   * Display search results
   * @param {Array} results - Array of post objects
   * @param {string} query - Original search query
   */
  displayResults(results, query) {
    if (results.length === 0) {
      this.resultsElement.innerHTML = `
        <div class="search-no-results" data-search-no-results>
          <p>No results found for "<strong>${this.escapeHtml(query)}</strong>"</p>
          <p>Try different keywords or check your spelling.</p>
        </div>
      `;
      return;
    }

    const resultsHtml = results
      .map(
        (post) => `
      <article class="search-result" data-search-result>
        <h3 class="search-result__title">
          <a href="${this.escapeHtml(post.url)}">${this.escapeHtml(post.title)}</a>
        </h3>
        ${
          post.excerpt
            ? `<p class="search-result__excerpt">${this.escapeHtml(post.excerpt)}</p>`
            : ""
        }
        <div class="search-result__meta">
          ${
            post.date
              ? `<time class="search-result__date" datetime="${this.escapeHtml(post.date)}">${this.formatDate(post.date)}</time>`
              : ""
          }
          ${
            post.tags && post.tags.length
              ? `<div class="search-result__tags">${post.tags.map((tag) => `<span class="search-result__tag">${this.escapeHtml(tag)}</span>`).join("")}</div>`
              : ""
          }
        </div>
      </article>
    `
      )
      .join("");

    this.resultsElement.innerHTML = `
      <div class="search-results" data-search-results-list>
        <p class="search-results__count">Found ${results.length} result${results.length !== 1 ? "s" : ""}</p>
        ${resultsHtml}
      </div>
    `;
  }

  /**
   * Clear search results display
   */
  clearResults() {
    this.resultsElement.innerHTML = "";
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    this.resultsElement.innerHTML = `
      <div class="search-loading" data-search-loading>
        <p>Loading search...</p>
      </div>
    `;
  }

  /**
   * Clear loading state
   */
  clearLoadingState() {
    if (
      this.resultsElement.querySelector("[data-search-loading]")
    ) {
      this.resultsElement.innerHTML = "";
    }
  }

  /**
   * Show error state
   * @param {string} message - Error message to display
   */
  showErrorState(message) {
    this.resultsElement.innerHTML = `
      <div class="search-error" data-search-error>
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  /**
   * Format date string for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }).format(date);
    } catch {
      return dateString;
    }
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return String(text).replace(/[&<>"']/g, (char) => map[char]);
  }

  /**
   * Clear cache
   */
  clearCache() {
    try {
      localStorage.removeItem(this.cacheVersion);
    } catch (error) {
      console.warn("BlogSearch: Cache clear error", error);
    }
  }

  /**
   * Destroy search instance
   */
  destroy() {
    if (this.inputElement) {
      this.inputElement.removeEventListener("focus", () =>
        this.ensureIndexLoaded()
      );
      this.inputElement.removeEventListener("input", (e) =>
        this.handleSearch(e)
      );
    }
    clearTimeout(this.debounceTimer);
    this.searchIndex = null;
    this.indexData = null;
    this.isInitialized = false;
  }
}

/**
 * Initialize BlogSearch on DOM ready
 */
function initializeSearch() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      new BlogSearch();
    });
  } else {
    new BlogSearch();
  }
}

// Initialize on load
if (typeof window !== "undefined") {
  initializeSearch();
}

// Export for CommonJS
if (typeof module !== "undefined" && module.exports) {
  module.exports = BlogSearch;
}
