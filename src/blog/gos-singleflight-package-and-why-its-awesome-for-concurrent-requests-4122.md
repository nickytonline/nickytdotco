---json
{
  "title": "Go's singleflight package and why it's awesome for concurrent requests",
  "excerpt": "Concurrency in Go is fun… until duplicate work starts hammering your backend.  I’m still pretty new...",
  "date": "2025-05-05T12:40:01Z",
  "tags": "go, identity, zerotrust",
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fjtxu5px6vlg5psrslcu9.webp",
  "canonical_url": "https://www.nickyt.co/blog/gos-singleflight-package-and-why-its-awesome-for-concurrent-requests-4122/",
  "reading_time_minutes": 3,
  "template": "post",
  "series": {
    "name": "Go",
    "collection_id": 31534
  }
}
---

Concurrency in Go is fun… until duplicate work starts hammering your backend.

I’m still pretty new to Go, but thanks to my awesome crew at [Pomerium](https://github.com/pomerium/pomerium), I’ve been learning fast by jumping into real-world code.

One recent pull request (PR) from my teammate Caleb really made this click. He introduced me to `singleflight`, a super handy tool for avoiding redundant work in concurrent code.

{% embed "https://github.com/pomerium/pomerium/pull/5491" %}

Imagine a burst of requests with the same [Identity Provider](https://en.wikipedia.org/wiki/Identity_provider) (IdP) token. Without coordination, each request would separately validate and create a session — wasting resources and hitting downstream systems hard.

In the pull request, Caleb solved that by wrapping session creation in `singleflight`. This ensures only one validation runs at a time, and all callers share the result. Much more efficient.

At first, I thought this was [memoization](https://en.wikipedia.org/wiki/Memoization), but `singleflight` is built specifically for **concurrent deduplication**, not long-term caching.

## What is `singleflight`?

`singleflight` prevents duplicate work when many goroutines make the same request simultaneously.  
Think of it like short-lived memoization: only concurrent calls are deduplicated. Once the result is returned, it’s gone — no persistent cache.

It’s perfect when you want to:

* Avoid request storms (e.g. validating the same token 100 times).
* Reduce load on databases or APIs.
* Provide consistent results during concurrency spikes.

## How it works

* **Deduplicates concurrent calls**: Goroutines calling `Do()` with the same key → only one runs.
* **Shares results**: All callers get the same result (including errors).
* **Cleans up automatically**: Once done, the entry is removed.
* **Works per key**: Different keys are isolated.

## Real-world example

In Caleb's PR, `singleflight` makes sure only one session gets created when a lot of requests hit at once with the same token.

```go  
{% raw %}
res, err, _ := c.singleflight.Do(sessionID, func() (any, error) {
    // Try to get existing session
    s, err := c.getSession(ctx, sessionID)
    if err == nil {
        return s, nil // Found existing session
    } else if !storage.IsNotFound(err) {
        return nil, err
    }

    // No existing session → create new one
    // Verify token and make API calls...

    err = c.putSessionAndUser(ctx, s, u)
    if err != nil {
        return nil, fmt.Errorf("error saving session and user: %w", err)
    }

    return s, nil
})
{% endraw %}
```

No matter how many concurrent requests hit, only one runs the logic.

## Why use `singleflight`

* **Prevent verification storms**: One verification instead of dozens.
* **Reduce database/API load**: No redundant work.
* **Return consistent results**: All callers see the same outcome.

`singleflight` vs memoization

Memoization caches results across time. `singleflight` only deduplicates concurrent calls.

| Memoization | `singleflight` |
| ----- | ----- |
| Long-term cache | Only during concurrent calls |
| Needs eviction/TTL | No expiry needed |
| Speeds up future calls | Avoids duplicate work right now |

---

## Final thoughts

`singleflight` is one of those elegant Go utilities that quietly solves a tough problem. When you’re dealing with concurrency and don’t want the hassle of caching or locking, it’s the perfect tool.

I’m still early in my Go journey, so running into patterns like this feels exciting. If you know other handy concurrency tricks (especially for someone coming from JS/C#/React land), drop them in the comments. I'm always down to learn 🚀

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).
