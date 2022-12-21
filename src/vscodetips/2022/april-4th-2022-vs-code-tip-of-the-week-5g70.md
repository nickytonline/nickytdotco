---json
{
  "title": "VS Code Tip of the Week: Open a Project from the Shell into same VS Code Window",
  "excerpt": "This week's tip is short and sweet.  My friend Chris on Twitter this week asked how do you open a...",
  "date": "2022-04-14T21:31:28.224Z",
  "tags": [
    "vscode",
    "vscodetips"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--6oo00mvN--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_svnb8uzsh2ox0k9hfy1w.png",
  "canonicalUrl": "https://www.iamdeveloper.com/vscodetips/2022/april-4th-2022-vs-code-tip-of-the-week-5g70",
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
