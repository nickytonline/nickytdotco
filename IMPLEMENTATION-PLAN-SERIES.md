# Implementation Plan: Series Component for Eleventy Blog

**Created:** 2024-12-14  
**Status:** Ready to Start  
**Related:** [PRD-SERIES-COMPONENT.md](./PRD-SERIES-COMPONENT.md)  
**Platform:** Eleventy (11ty) with Nunjucks

---

## 🎯 Quick Summary

Add series support to the Eleventy blog by:
1. Detecting `collection_id` from dev.to API
2. Creating Nunjucks component matching dev.to's style
3. Integrating into post template

**Key Files:**
- `bin/generateDevToPosts.js` - Add collection_id detection
- `src/_includes/partials/components/series-navigation.njk` - New component
- `.eleventy.js` - Add series filters
- `src/_includes/layouts/post.njk` - Include component

---

## 📋 Current State Analysis

### ✅ What Exists
- Eleventy 2.0.1 with Nunjucks templates
- `bin/generateDevToPosts.js` syncs from dev.to API
- JSON frontmatter in markdown files
- Post template at `src/_includes/layouts/post.njk`
- Collections setup in `.eleventy.js`

### ❌ What's Missing
- No `collection_id` capture from API
- No `series` field in frontmatter
- No series component
- No series filters in Eleventy config

### 📊 Sample API Response (what we get from dev.to)

```javascript
{
  "id": 3104259,
  "title": "Advent of AI - Day 10...",
  "collection_id": 34295,  // ← THIS IS WHAT WE NEED!
  "published_at": "2025-12-14T05:56:41Z",
  "tag_list": ["automation", "ai", "goose"],
  "reading_time_minutes": 7,
  // ... other fields
}
```

---

## 🚀 Phase 1: Update generateDevToPosts.js

**Goal:** Capture `collection_id` and add series to frontmatter

**Time Estimate:** 2-3 hours

### Step 1.1: Add Series Name Mapping

**Location:** Top of `bin/generateDevToPosts.js` (after constants)

```javascript
// Series ID to Name mapping (manual curation for known series)
const SERIES_NAMES = {
  34295: "Advent of AI 2025",
  // Add more as you discover them
};

/**
 * Gets the series name from collection_id or infers from title
 * @param {number} collection_id - The dev.to collection ID
 * @param {string} title - The article title
 * @returns {string} Series name
 */
function getSeriesName(collection_id, title) {
  // Check manual mapping first
  if (SERIES_NAMES[collection_id]) {
    return SERIES_NAMES[collection_id];
  }
  
  // Try to extract from title pattern: "Series Name - Part/Day/Episode X: ..."
  const patterns = [
    /^(.+?)\s*-\s*(?:Part|Day|Episode)\s*\d+/i,
    /^(.+?)\s*\(Part\s*\d+\)/i,
    /^(.+?)\s*#\d+/i,
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  // Fallback: use collection ID
  console.warn(`Could not infer series name for collection ${collection_id}, title: "${title}"`);
  return `Series ${collection_id}`;
}
```

---

### Step 1.2: Modify createPostFile Function

**Location:** Find the `createPostFile` function (around line 240)

**Current code:**
```javascript
const jsonFrontmatter = {
  title,
  excerpt,
  date,
  tags,
  cover_image,
  canonical_url,
  reading_time_minutes,
  template: "post",
};
```

**Updated code:**
```javascript
const jsonFrontmatter = {
  title,
  excerpt,
  date,
  tags,
  cover_image,
  canonical_url,
  reading_time_minutes,
  template: "post",
};

// Add series data if post is part of a collection
if (post.collection_id) {
  const seriesName = getSeriesName(post.collection_id, title);
  jsonFrontmatter.series = {
    name: seriesName,
    collection_id: post.collection_id
  };
  
  console.log(`  📚 Added to series: "${seriesName}" (ID: ${post.collection_id})`);
}
```

---

### Step 1.3: Test the Changes

**Commands:**
```bash
cd /Users/nicktaylor/dev/oss/www.nickyt.co

# Make sure you have DEV_API_KEY in .env
# Test with a single post first
node bin/generateDevToPosts.js
```

**Verification:**
1. Open a post that should be in a series (e.g., an Advent of AI post)
2. Check the frontmatter contains:
```json
{
  "series": {
    "name": "Advent of AI 2025",
    "collection_id": 34295
  }
}
```

---

## 🚀 Phase 2: Add Eleventy Filters

**Goal:** Enable series querying in templates

**Time Estimate:** 1 hour

### Step 2.1: Add Series Filters to .eleventy.js

**Location:** `.eleventy.js` - Add after existing filters (around line 30)

```javascript
// Series Filters
config.addFilter('seriesFilter', function(collection, series) {
  if (!series) return [];
  
  // Normalize series identifier
  const seriesId = typeof series === 'string' 
    ? series 
    : (series.collection_id ? String(series.collection_id) : series.name);
  
  return collection.filter(post => {
    const postSeries = post.data.series;
    if (!postSeries) return false;
    
    const postSeriesId = typeof postSeries === 'string'
      ? postSeries
      : (postSeries.collection_id ? String(postSeries.collection_id) : postSeries.name);
    
    return postSeriesId === seriesId;
  });
});

config.addFilter('seriesName', function(series) {
  if (!series) return '';
  return typeof series === 'string' ? series : series.name;
});

config.addFilter('truncate', function(str, length = 100) {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + '...';
});
```

**Test:**
```bash
npm run serve
# Check for any errors in the terminal
```

---

## 🚀 Phase 3: Create Series Navigation Component

**Goal:** Build the visual component

**Time Estimate:** 2-3 hours

### Step 3.1: Create Component File

**File:** `src/_includes/partials/components/series-navigation.njk`

```njk
{# Series Navigation Component
   Displays all posts in a series with current post highlighted
   Matches dev.to visual style
#}

{% if series %}
  {# Get all posts in this series, sorted by date #}
  {% set seriesPosts = collections.posts | seriesFilter(series) | sort(attribute='date') %}
  
  {% if seriesPosts.length > 1 %}
    <nav class="series-navigation" aria-label="Series navigation" role="navigation">
      <h2 class="series-header">
        {{ series | seriesName }} ({{ seriesPosts.length }} Part Series)
      </h2>
      
      <ol class="series-list" role="list">
        {% for post in seriesPosts %}
          {% set postIndex = loop.index %}
          {% set isCurrent = (post.url == page.url) %}
          
          <li class="series-item {% if isCurrent %}series-item--current{% endif %}" role="listitem">
            <span class="series-badge {% if isCurrent %}series-badge--current{% endif %}" aria-hidden="true">
              {{ postIndex }}
            </span>
            
            <div class="series-content">
              {% if isCurrent %}
                <span class="series-title series-title--current">
                  {{ post.data.title }}
                </span>
                <span class="sr-only">(current post)</span>
              {% else %}
                <a href="{{ post.url }}" class="series-title series-title--link">
                  {{ post.data.title | truncate(80) }}
                </a>
              {% endif %}
            </div>
          </li>
        {% endfor %}
      </ol>
      
      {# Optional: Previous/Next navigation #}
      {% set currentIndex = seriesPosts | findIndex(page.url) %}
      {% if currentIndex > 0 or currentIndex < seriesPosts.length - 1 %}
        <div class="series-nav">
          {% if currentIndex > 0 %}
            {% set prevPost = seriesPosts[currentIndex - 1] %}
            <a href="{{ prevPost.url }}" class="series-nav-link series-nav-link--prev">
              ← Previous in series
            </a>
          {% endif %}
          
          {% if currentIndex < seriesPosts.length - 1 %}
            {% set nextPost = seriesPosts[currentIndex + 1] %}
            <a href="{{ nextPost.url }}" class="series-nav-link series-nav-link--next">
              Next in series →
            </a>
          {% endif %}
        </div>
      {% endif %}
    </nav>
  {% endif %}
{% endif %}
```

---

### Step 3.2: Add CSS Styles

**File:** `src/scss/_series-navigation.scss` (create new file)

```scss
.series-navigation {
  background-color: var(--color-light);
  border: 1px solid var(--color-mid);
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 2rem 0;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--color-dark-glare);
    border-color: var(--color-dark);
  }
}

.series-header {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-theme-primary);
  margin: 0 0 1.5rem 0;
  
  @media (prefers-color-scheme: dark) {
    color: var(--color-theme-primary-glare);
  }
}

.series-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.series-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.series-badge {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: var(--color-mid);
  color: var(--color-dark);
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--color-dark);
    color: var(--color-light);
  }
}

.series-badge--current {
  background-color: var(--color-theme-primary);
  color: white;
  
  @media (prefers-color-scheme: dark) {
    background-color: var(--color-theme-primary-glare);
  }
}

.series-content {
  flex: 1;
  padding-top: 0.25rem;
  min-width: 0; /* Allow text truncation */
}

.series-title {
  font-size: 1rem;
  line-height: 1.5;
  display: block;
}

.series-title--current {
  color: var(--color-theme-primary);
  font-weight: 600;
  
  @media (prefers-color-scheme: dark) {
    color: var(--color-theme-primary-glare);
  }
}

.series-title--link {
  color: var(--color-text);
  text-decoration: none;
  
  &:hover,
  &:focus {
    color: var(--color-theme-primary);
    text-decoration: underline;
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--color-light);
    
    &:hover,
    &:focus {
      color: var(--color-theme-primary-glare);
    }
  }
}

.series-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-mid);
  
  @media (prefers-color-scheme: dark) {
    border-color: var(--color-dark);
  }
}

.series-nav-link {
  color: var(--color-theme-primary);
  text-decoration: none;
  font-weight: 500;
  
  &:hover,
  &:focus {
    text-decoration: underline;
  }
  
  @media (prefers-color-scheme: dark) {
    color: var(--color-theme-primary-glare);
  }
}

.series-nav-link--next {
  margin-left: auto;
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Import in main SCSS:**

**File:** `src/scss/global.scss`

Add near the top:
```scss
@import 'series-navigation';
```

---

### Step 3.3: Add findIndex Filter (for prev/next nav)

**File:** `.eleventy.js`

```javascript
config.addFilter('findIndex', function(array, url) {
  return array.findIndex(item => item.url === url);
});
```

---

## 🚀 Phase 4: Integrate into Post Template

**Goal:** Display series component on blog posts

**Time Estimate:** 30 minutes

### Step 4.1: Update post.njk Template

**File:** `src/_includes/layouts/post.njk`

**Add after the post intro, before content:**

```njk
{% block content %}
  <main id="main-content" tabindex="-1">
    <article class="[ post ] [ h-entry ]">
      {% include "partials/components/post-intro.njk" %}
      
      {# ADD THIS: Series Navigation #}
      {% if series %}
        {% include "partials/components/series-navigation.njk" %}
      {% endif %}
      
      <div class="[ post__body ] [ inner-wrapper ] [ leading-loose text-500 ] [ sf-flow ] [ e-content ]">
        {{ content | safe }}
      </div>
      
      {# ... rest of template ... #}
```

---

## 🚀 Phase 5: Testing

**Goal:** Verify everything works

**Time Estimate:** 1-2 hours

### Test Checklist

#### 5.1 Functional Tests

- [ ] **Sync Test**
  ```bash
  node bin/generateDevToPosts.js
  ```
  - Verify Advent of AI posts have `series` in frontmatter
  - Check series name is correct
  - Check collection_id is captured

- [ ] **Build Test**
  ```bash
  npm run production
  ```
  - No build errors
  - Check dist/blog/ files

- [ ] **Dev Server Test**
  ```bash
  npm start
  ```
  - Navigate to series post
  - Series component displays
  - All posts in series listed
  - Current post highlighted
  - Links work

#### 5.2 Visual Tests

- [ ] **Desktop**
  - Component renders correctly
  - Badges aligned
  - Text truncates properly
  - Hover states work

- [ ] **Mobile**
  - Responsive layout
  - No horizontal scroll
  - Touch targets adequate

- [ ] **Dark Mode**
  - Colors appropriate
  - Contrast sufficient
  - Primary color visible

#### 5.3 Edge Cases

- [ ] Single post in series (shouldn't show component)
- [ ] Post not in series (shouldn't show component)
- [ ] Long series (10+ posts)
- [ ] Very long post titles
- [ ] Manual series (string format)

---

## 🚀 Phase 6: Optional Enhancements

### 6.1 Collapse Long Series

**Goal:** Show first 2, last 2, collapse middle for 5+ posts

**Time:** 2 hours

**Implementation in series-navigation.njk:**

```njk
{% set COLLAPSE_THRESHOLD = 5 %}
{% set SHOW_FIRST = 2 %}
{% set SHOW_LAST = 2 %}

{% if seriesPosts.length >= COLLAPSE_THRESHOLD %}
  {# Show first posts #}
  {% for post in seriesPosts | slice(0, SHOW_FIRST) %}
    {# render post item #}
  {% endfor %}
  
  {# Collapsed indicator #}
  <li class="series-item series-item--collapsed">
    <span class="series-badge series-badge--ellipsis" aria-hidden="true">...</span>
    <div class="series-content">
      <span class="series-collapsed-text">
        {{ seriesPosts.length - SHOW_FIRST - SHOW_LAST }} more parts...
      </span>
    </div>
  </li>
  
  {# Show last posts #}
  {% for post in seriesPosts | slice(-SHOW_LAST) %}
    {# render post item #}
  {% endfor %}
{% else %}
  {# Show all posts #}
  {% for post in seriesPosts %}
    {# render post item #}
  {% endfor %}
{% endif %}
```

---

## 📊 File Structure Summary

```
www.nickyt.co/
├── bin/
│   └── generateDevToPosts.js (MODIFIED - add series detection)
├── src/
│   ├── _includes/
│   │   ├── layouts/
│   │   │   └── post.njk (MODIFIED - include series component)
│   │   └── partials/
│   │       └── components/
│   │           └── series-navigation.njk (NEW)
│   ├── scss/
│   │   ├── _series-navigation.scss (NEW)
│   │   └── global.scss (MODIFIED - import new styles)
│   └── blog/
│       └── *.md (MODIFIED frontmatter - series field added)
└── .eleventy.js (MODIFIED - add filters)
```

---

## 🎯 Success Criteria

**Phase 1 Complete When:**
- [ ] `collection_id` captured in frontmatter
- [ ] Series name added to frontmatter
- [ ] Existing posts resync successfully

**Phase 2-4 Complete When:**
- [ ] Series component renders on posts
- [ ] Visual style matches dev.to
- [ ] Navigation works correctly
- [ ] Responsive and accessible

**All Phases Complete When:**
- [ ] All tests passing
- [ ] No build errors
- [ ] Documentation updated
- [ ] Deployed to production

---

## 🐛 Troubleshooting

### Issue: collection_id not appearing in frontmatter

**Check:**
1. Is `collection_id` in the API response?
   ```javascript
   console.log('Post data:', JSON.stringify(post, null, 2));
   ```
2. Is the `getSeriesName` function being called?
3. Check for typos in property names

### Issue: Series component not showing

**Check:**
1. Does the post have `series` in frontmatter?
2. Are there multiple posts in the series?
3. Is the component included in `post.njk`?
4. Check browser console for errors

### Issue: Styles not applying

**Check:**
1. Is `_series-navigation.scss` imported in `global.scss`?
2. Run `npm run sass:process` to rebuild CSS
3. Hard refresh browser (Cmd+Shift+R)
4. Check CSS custom properties are defined

---

## 📝 Next Steps After Implementation

1. **Monitor:** Watch for series posts from dev.to
2. **Curate:** Update `SERIES_NAMES` mapping as new series appear
3. **Enhance:** Consider adding series landing pages
4. **Analytics:** Track series navigation usage
5. **Feedback:** Get user feedback on design

---

## 📚 Reference

### Eleventy Filters Documentation
- https://www.11ty.dev/docs/filters/

### Nunjucks Documentation
- https://mozilla.github.io/nunjucks/templating.html

### dev.to API
- https://developers.forem.com/api/v1

---

**Last Updated:** 2024-12-14  
**Next Review:** After Phase 1 completion
