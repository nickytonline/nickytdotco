---json
{
  "title": "VS Code Tip of the Week: Open a Project from the Shell into same VS Code Window",
  "excerpt": "This week's tip is short and sweet.  My friend Chris on Twitter this week asked how do you open a...",
  "date": "2022-04-14T21:31:28.224Z",
  "tags": [
    "vscode",
    "vscodetips"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_cdn-cgi_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fsvnb8uzsh2ox0k9hfy1w.png",
  "canonical_url": "https://www.nickyt.co/vscodetips/2022/april-4th-2022-vs-code-tip-of-the-week-5g70/",
  "reading_time_minutes": 1,
  "template": "post"
}
---

This week's tip is short and sweet.

My friend Chris on Twitter this week asked how do you open a project from a shell without opening another VS Code window.

{% embed "https://twitter.com/saltnburnem/status/1508986426737709057" %}

All you nee to do is add the `-r` flag to reuse the window, e.g.

```bash
{% raw %}
code -r ./some-folder
{% endraw %}
```

or 

```bash
{% raw %}
code ./some-folder -r
{% endraw %}
```

The same goes for individual files.

```bash
{% raw %}
code -r ./some-file.ext
{% endraw %}
```

or 

```bash
{% raw %}
code ./some-file.ext -r
{% endraw %}
```

Happy VS Coding!
