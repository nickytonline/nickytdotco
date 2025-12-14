# PRD: Series Component for Eleventy Blog

## 🎯 Overview

Add series support to the Eleventy blog to match the visual style and functionality of dev.to's series display, enabling readers to easily navigate related posts.

**Status:** Planning  
**Priority:** Medium  
**Target Completion:** TBD  
**Blog Platform:** Eleventy (11ty) with Nunjucks templates

---

## 📋 Background

The blog currently:
- ✅ Uses `bin/generateDevToPosts.js` to sync posts from dev.to
- ✅ Stores posts as Markdown files with JSON frontmatter
- ✅ Uses Nunjucks templates for rendering
- ❌ No series detection or display
- ❌ No `collection_id` capture from dev.to API
- ❌ No series navigation component

**Current Frontmatter Structure:**
```json
{
  "title": "Post Title",
  "excerpt": "Description",
  "date": "2025-12-14T05:56:41.653Z",
  "tags": ["tag1", "tag2"],
  "cover_image": "https://...",
  "canonical_url": "https://www.nickyt.co/blog/...",
  "reading_time_minutes": 7,
  "template": "post"
}
```

**Missing:** `series` and `collection_id` fields

---

## 🎯 Goals

### Primary Goals
1. Detect series from dev.to API (`collection_id` field)
2. Store series metadata in post frontmatter
3. Create Nunjucks component matching dev.to's series visual style
4. Display series navigation on posts that are part of a series

### Secondary Goals
1. Support manual series creation (for non-dev.to posts)
2. Maintain backward compatibility (no breaking changes)
3. Optimize for light and dark modes
4. Enable series discovery/browsing

---

## 👥 User Stories

### As a blog reader, I want to:
- See which posts belong to a series
- Navigate easily between posts in a series
- Know my current position in the series (e.g., "Part 3 of 9")
- View collapsed series lists when there are many posts

### As a content author (Nick), I want to:
- Automatically sync series data from dev.to
- Have series display without manual configuration
- Support both dev.to series and manual series
- Maintain consistent series naming across platforms

---

## 🎨 Design Requirements

### Visual Design (Based on dev.to Screenshot)

```
┌───────────────────────────────────────────┐
│ Advent of AI 2025 (9 Part Series)        │ ← Header with series name + count
├───────────────────────────────────────────┤
│ ● 1  Advent of AI 2025 - Day 1: Getting..│ ← Current post (highlighted, blue badge)
│   2  Advent of AI 2025 - Day 2: Building.│ ← Other post (gray badge)
│ ...  5 more parts...                      │ ← Collapsed middle section
│   8  Advent of AI 2025 - Day 8: Messy... │
│   9  Advent of AI 2025 - Day 9: Building.│
└───────────────────────────────────────────┘
```

### Design Elements

1. **Container**
   - Rounded corners (`border-radius: 8px`)
   - Border: `1px solid #e5e7eb` (light) / `#374151` (dark)
   - Background: `#f9fafb` (light) / `#111827` (dark)
   - Padding: `1.5rem`
   - Margin: `2rem 0`

2. **Series Header**
   - Font size: `1.25rem` (20px)
   - Font weight: `700` (bold)
   - Color: `#6366f1` (indigo-500) or blog primary color
   - Format: `{Series Name} ({count} Part Series)`

3. **Post List Items**
   - Numbered circular badges
   - Current post: Blue/primary background, white text
   - Other posts: Gray background, dark text
   - Hover state: Underline link text
   - Truncate long titles with ellipsis

4. **Collapse Behavior** (for 5+ posts)
   - Show first 2 posts
   - Collapse middle with "X more parts..."
   - Show last 2 posts
   - Expandable on click (optional enhancement)

---

## 🔧 Technical Requirements

### 1. Data Schema Updates

**Update Post Frontmatter:**
```json
{
  "title": "...",
  "excerpt": "...",
  "date": "...",
  "tags": [...],
  "cover_image": "...",
  "canonical_url": "...",
  "reading_time_minutes": 7,
  "template": "post",
  
  // NEW FIELDS
  "series": {
    "name": "Advent of AI 2025",
    "collection_id": 34295
  }
  // OR simple string for manual series
  "series": "My Series Name"
}
```

**Backward Compatibility:**
- Support both `series: "string"` and `series: { name, collection_id }`
- Missing series field = not part of a series

### 2. Component Architecture

**New Files:**
1. `src/_includes/partials/components/series-navigation.njk` - Main component
2. `src/_data/seriesData.json` - Cached series metadata (optional)

**Modified Files:**
1. `bin/generateDevToPosts.js` - Add collection_id detection
2. `src/_includes/layouts/post.njk` - Include series component

### 3. Nunjucks Component Structure

**File:** `src/_includes/partials/components/series-navigation.njk`

```njk
{# Get all posts in this series #}
{% set seriesPosts = collections.posts | seriesFilter(series) | sort('date') %}

{% if seriesPosts.length > 1 %}
<nav class="series-navigation" aria-label="Series navigation">
  <h2 class="series-header">
    {{ seriesName(series) }} ({{ seriesPosts.length }} Part Series)
  </h2>
  
  <ol class="series-list">
    {% for post, index in seriesPosts %}
      <li class="series-item {% if post.url == page.url %}current{% endif %}">
        <span class="series-badge">{{ index + 1 }}</span>
        {% if post.url == page.url %}
          <span class="series-title current">{{ post.data.title }}</span>
        {% else %}
          <a href="{{ post.url }}" class="series-title">{{ post.data.title }}</a>
        {% endif %}
      </li>
    {% endfor %}
  </ol>
</nav>
{% endif %}
```

### 4. Eleventy Collection Filter

**File:** `.eleventy.js`

```javascript
// Add custom filter to get posts in same series
config.addFilter('seriesFilter', function(collection, series) {
  if (!series) return [];
  
  const seriesId = typeof series === 'string' 
    ? series 
    : series.collection_id || series.name;
  
  return collection.filter(post => {
    const postSeries = post.data.series;
    if (!postSeries) return false;
    
    const postSeriesId = typeof postSeries === 'string'
      ? postSeries
      : postSeries.collection_id || postSeries.name;
    
    return postSeriesId === seriesId;
  });
});

// Helper to get series name
config.addFilter('seriesName', function(series) {
  if (!series) return '';
  return typeof series === 'string' ? series : series.name;
});
```

---

## 📊 Data Flow

### Automatic Detection (dev.to posts)

```
1. bin/generateDevToPosts.js runs
   ↓
2. Fetch article from dev.to API
   ↓
3. Check article.collection_id
   ↓
4. If exists:
   - Fetch series name (from title pattern or manual mapping)
   - Add to frontmatter: { series: { name, collection_id } }
   ↓
5. Write markdown file with series data
   ↓
6. Eleventy builds site
   ↓
7. post.njk template includes series-navigation.njk
   ↓
8. seriesFilter finds all posts with same series
   ↓
9. Render series component
```

### Manual Series (non-dev.to posts)

```
1. Author adds to frontmatter: series: "Series Name"
   ↓
2. Eleventy builds site
   ↓
3. seriesFilter matches by string name
   ↓
4. Render series component
```

---

## 🚀 Implementation Plan

### Phase 1: Update generateDevToPosts.js (PRIORITY)
**Goal:** Detect and store collection_id from dev.to API

**Tasks:**
- [ ] Modify `createPostFile()` to check for `collection_id` in API response
- [ ] Add series name inference (from title pattern)
- [ ] Add manual series name mapping for known series
- [ ] Update frontmatter JSON to include series object
- [ ] Test with existing Advent of AI posts
- [ ] Run sync and verify frontmatter updates

**Estimated Time:** 2-3 hours

---

### Phase 2: Create Series Component
**Goal:** Build Nunjucks component matching dev.to style

**Tasks:**
- [ ] Create `series-navigation.njk` component
- [ ] Add CSS styles matching dev.to design
- [ ] Implement numbered badges
- [ ] Add current post highlighting
- [ ] Test with light/dark mode
- [ ] Test responsive layout

**Estimated Time:** 2-3 hours

---

### Phase 3: Add Eleventy Filters
**Goal:** Enable series querying and filtering

**Tasks:**
- [ ] Add `seriesFilter` to `.eleventy.js`
- [ ] Add `seriesName` helper filter
- [ ] Test filters with collections
- [ ] Handle edge cases (no series, single post)

**Estimated Time:** 1 hour

---

### Phase 4: Integrate into Post Template
**Goal:** Display series on blog posts

**Tasks:**
- [ ] Update `post.njk` to include series component
- [ ] Position component (above content? after intro?)
- [ ] Test with series and non-series posts
- [ ] Verify no layout breaks

**Estimated Time:** 1 hour

---

### Phase 5: Collapse Functionality (Optional)
**Goal:** Handle long series gracefully

**Tasks:**
- [ ] Implement collapse logic (first 2, last 2, collapse middle)
- [ ] Add "X more parts..." indicator
- [ ] Optional: Add JS for expand/collapse
- [ ] Test with 10+ post series

**Estimated Time:** 2-3 hours

---

### Phase 6: Testing & Documentation
**Goal:** Ensure quality and maintainability

**Tasks:**
- [ ] Test all series posts
- [ ] Verify dev.to sync
- [ ] Test manual series
- [ ] Update README
- [ ] Document series frontmatter format
- [ ] Create developer guide

**Estimated Time:** 2 hours

---

## 🎯 Success Metrics

1. **Detection Rate:** >90% of dev.to series auto-detected
2. **Visual Parity:** Component closely matches dev.to style
3. **Performance:** No measurable impact on build time
4. **Compatibility:** All existing posts build successfully
5. **Maintainability:** Clear documentation for future updates

---

## 🚧 Technical Challenges

### Challenge 1: Series Name Discovery
**Problem:** dev.to API doesn't return series name directly

**Solutions:**
1. **Pattern Matching:** Extract from title (e.g., "Series Name - Part X: Title")
2. **Manual Mapping:** Hardcode known series IDs → names
3. **Fetch First Post:** Use first post's title pattern
4. **User Prompt:** Ask during sync (for new series)

**Recommendation:** Manual mapping + pattern matching fallback

**Example Implementation:**
```javascript
const SERIES_NAMES = {
  34295: "Advent of AI 2025",
  // Add more as discovered
};

function getSeriesName(collection_id, articleTitle) {
  // Check manual mapping first
  if (SERIES_NAMES[collection_id]) {
    return SERIES_NAMES[collection_id];
  }
  
  // Try to extract from title pattern
  const match = articleTitle.match(/^(.+?)\s*-\s*(?:Part|Day|Episode)\s*\d+/i);
  if (match) {
    return match[1].trim();
  }
  
  // Fallback
  return `Series ${collection_id}`;
}
```

---

### Challenge 2: Post Ordering
**Problem:** How to determine order within series?

**Solutions:**
1. **Date-based:** Sort by `published_at` (chronological)
2. **Title-based:** Extract "Day X", "Part Y" from title
3. **Manual:** Add `series_order` field to frontmatter
4. **Hybrid:** Date primary, manual override

**Recommendation:** Date-based with optional manual override

---

### Challenge 3: Collection_id Not in Initial API Call
**Problem:** `/articles/me/published` might not include `collection_id`

**Investigation Needed:**
- Check if collection_id is in list response
- If not, need to fetch each article individually
- This impacts performance (rate limiting)

**Solution:**
- Test API response structure
- If missing, add individual fetch for series posts
- Cache results to minimize API calls

---

## 🔍 Open Questions

1. **Series Name Source:** Manual mapping vs. automated extraction?
2. **Sync Frequency:** When to update series data? (Every build? Manual command?)
3. **Partial Series:** Handle posts where only some are on the blog?
4. **Series Landing Pages:** Create `/series/[slug]` pages? (Future enhancement)
5. **Historical Posts:** Re-sync old posts to detect series?

---

## 📚 Resources

- [dev.to API Documentation](https://developers.forem.com/api/v1)
- [Eleventy Collections](https://www.11ty.dev/docs/collections/)
- [Nunjucks Templating](https://mozilla.github.io/nunjucks/)
- [Current generateDevToPosts.js](./bin/generateDevToPosts.js)
- [Current post.njk template](./src/_includes/layouts/post.njk)

---

## 🗓️ Timeline

**Total Estimated Time:** 10-14 hours

**Suggested Schedule:**
- **Week 1:** Phases 1-2 (Script + Component)
- **Week 2:** Phases 3-4 (Integration)
- **Week 3:** Phases 5-6 (Optional features + Testing)

---

## ✅ Definition of Done

- [ ] generateDevToPosts.js detects collection_id
- [ ] Series metadata stored in frontmatter
- [ ] Series component renders correctly
- [ ] Visual style matches dev.to
- [ ] Works in light and dark mode
- [ ] Responsive design works on mobile
- [ ] No breaking changes to existing posts
- [ ] Documentation complete
- [ ] Tested with real series data

---

## 🔄 Future Enhancements

1. Series landing pages (`/series/[slug]`)
2. Series-specific RSS feeds
3. "Read next in series" CTA at end of posts
4. Series completion tracking
5. Series archive page listing all series
6. Automatic series thumbnail generation
7. Series analytics

---

## 📝 Notes

- Keep components simple and semantic
- Ensure accessibility (proper heading hierarchy, ARIA labels)
- Test with 1, 3, 5, 10, and 20+ post series
- Consider caching series data to avoid recalculation
- Maintain Eleventy's static generation benefits (no client-side JS required for base functionality)
