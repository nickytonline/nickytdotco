---json
{
  "title": "Don't Get Rate-Limited: Use Let's Encrypt Staging",
  "excerpt": "While getting Pomerium Core set up this week for a demo, I ran into Let's Encrypt rate limits. Here’s...",
  "date": "2025-06-16T05:00:00Z",
  "tags": [
    "letsencrypt",
    "security",
    "tls",
    "devops"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fzrt2ye5wwpszvceepugs.jpg",
  "canonical_url": "https://www.nickyt.co/blog/dont-get-rate-limited-use-lets-encrypt-staging-4kk2",
  "reading_time_minutes": 3,
  "template": "post"
}
---

While getting [Pomerium Core](https://github.com/pomerium/pomerium) set up this week for a demo, I ran into Let's Encrypt rate limits. Here’s how using Let's Encrypt staging can save you time when setting up auto-provisioned certificates.

For context, I work at [Pomerium](https://www.pomerium.com/). This was part of a local demo stack I was building with Docker Compose. Pomerium is an identity-aware proxy (think of it as an application gateway) that secures access to your apps with built-in policy enforcement, SSO, microsegmentation etc. All the Zero Trust security goodies.

I had [autocert](https://www.pomerium.com/docs/get-started/fundamentals/core/production-certificates#how-autocert-works-with-pomerium) enabled for Pomerium in my config.yaml:

```yaml
{% raw %}
autocert: true
{% endraw %}
```

### What is autocert?

[autocert](https://www.pomerium.com/docs/get-started/fundamentals/core/production-certificates#how-autocert-works-with-pomerium) is a Pomerium feature that automatically provisions and renews TLS certificates for your routes using [Let’s Encrypt](https://letsencrypt.org/).
No manual cert management, no copying files around — just tell Pomerium to handle it and it will issue valid certificates on the fly.

This works great… until you accidentally annoy Let’s Encrypt while testing.

## What happened

I was adding a few test routes (`verify.demo.maisonlab.dev`, `authenticate.demo.maisonlab.dev`, etc.) and restarting Pomerium repeatedly to tweak my config.

Then this showed up in the logs:

```json
{% raw %}
HTTP 429 urn:ietf:params:acme:error:rateLimited - too many certificates (5) already issued for this exact set of domains in the last 168h0m0s
{% endraw %}
```

**Rate limited.** No more certs for `verify.demo.maisonlab.dev` for 7 days.

## Why this happened

First, I had the wrong volume path for the autocert cache:

```diff
{% raw %}
services:
  pomerium:
    image: pomerium:mcp
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./config.yaml:/pomerium/config.yaml:ro
-      - ./pomerium-cache:/pomerium/.cache
+      - ./pomerium-cache:/data/autocert
+      # this is where Pomerium stores autocert data
    networks:
      - pom-network

# ...
{% endraw %}
```

Without the correct cache volume, Pomerium wasn’t persisting issued certs between Docker compose restarts. Each time I restarted the Pomerium container, it tried to re-request a new cert and Let’s Encrypt counted every attempt.

Second, even *failed* attempts count toward Let’s Encrypt’s certificate provisioning quota. 🫠

* [Up to 50 certificates can be issued per registered domain (or IPv4 address, or IPv6 /64 range) every 7 days](https://letsencrypt.org/docs/rate-limits/#limit-1)
* [Up to 5 certificates can be issued per exact same set of identifiers every 7 days](https://letsencrypt.org/docs/rate-limits/#limit-2)
* Once you hit the limit, you’re stuck waiting 7 days for that domain.

## The fix: use staging while testing

If you’re working on a new Pomerium setup, use Let’s Encrypt’s **staging environment** while testing certificate provisioning:

```yaml
{% raw %}
autocert: true
# autocert_ca defaults to https://acme-v02.api.letsencrypt.org/directory
autocert_ca: https://acme-staging-v02.api.letsencrypt.org/directory
{% endraw %}
```

See the [autocert_ca](https://www.pomerium.com/docs/reference/autocert#autocert-ca) docs. When you point Pomerium at the staging certificate authority (CA):

* You can test your flow without worrying about production rate limits.
* The only catch: staging certs aren’t trusted by browsers (you’ll get a warning), but that’s fine for local testing.

Once your config is good and your cert cache is persisting properly, flip back to production by removing the `autocert_ca` line.

## TL;DR

If you see:

```json
{% raw %}
HTTP 429 urn:ietf:params:acme:error:rateLimited
{% endraw %}
```

You’re in rate-limit jail for 7 days.

![Fred Armissen as a dictator saying Straight to jail!](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJtMHo2a3NtYmw3aXIzb2t1cXdmejFycDVwbGEyY3hnb2N1OTJqMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f8lDluiWJ7yQTtdS3L/giphy.gif)

- Make sure your autocert volume is correct for the Pomerium container, i.e. (`/data/autocert`).
- Use [Let’s Encrypt staging](https://letsencrypt.org/docs/staging-environment/) while testing.
- Flip back to production once you’re happy.

**One last note:** This isn’t a Pomerium-specific quirk. It’s how Let’s Encrypt’s [rate limits](https://letsencrypt.org/docs/rate-limits/) work in general. If you’re automating certificate issuance with any tool, the same caution applies when testing.

Hope this saves someone else a bit of time (and avoids a few unnecessary retries).
If you’re building out your own Pomerium setup and hit this, now you know what’s going on. Also, if you're using Pomerium, hit me up! I'd love to know how you're using it or what issues you run into, if any.

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).

Photo by <a href="https://unsplash.com/@andreuuuw?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Andrew Wulf</a> on <a href="https://unsplash.com/photos/pile-of-rubber-duckies-59yg_LpcvzQ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
