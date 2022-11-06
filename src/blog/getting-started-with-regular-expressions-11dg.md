---json
{
  "title": "Getting Started with Regular Expressions",
  "excerpt": "Regular expressions (regex) are one of those things that folks seem to make fun of most of the time...",
  "date": "2021-07-18T04:17:00.531Z",
  "tags": [
    "regex",
    "beginners",
    "javascript"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--YB4J_ik4--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_z4v5ldpkdcyphu9m07w4.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/getting-started-with-regular-expressions-11dg/",
  "reading_time_minutes": 4,
  "template": "post"
}
---

Regular expressions (regex) are one of those things that folks seem to make fun of most of the time because they don't understand them, or partially understand them.

I decided to write this post after Ben Hong Tweeted out asking for good regex resources.

{% twitter "1416417046150193152" %}

Is this post going to make you a regex expert? No, but it will teach some of the pitfalls that developers succumb to when writing them.

The example code snippets shown in the post will be for regular expressions in JavaScript, but you should be able to use them in your language of choice or at least the concepts if the syntax is slightly different.

## Be Specific

Know exactly what you're looking for. This may sound obvious on the surface, but it's not always the case. Let's say I want to find instances of `three` in a text file because we need to replace all instances of `three` with the number `3`. You've done a bit of Googling and or checked out [regex101.com](https://regex101.com). You're feeling pretty good so you write out this regular expression.

```javascript
{% raw %}
const reMatchThree = /three/g
{% endraw %}
```

Note: If you're new to regular expressions, everything between the starting `/` and the ending `/` is the regular expression. The `g` after the last `/` means global, as in find all instances.

You run the regular expression to match all instances of `three` so it can be replaced with `3`. You look at what got replaced in the text and you're a little perplexed.

```diff
{% raw %}
- There were three little pigs who lived in their own houses to stay safe from the big bad wolf who was thirty-three years old.
+ There were 3 little pigs who lived in their own houses to stay safe from the big bad wolf who was thirty-3 years old.
{% endraw %}
```

`three` got replaced by `3` everywhere in the file, but why was thirty-three replaced? You only wanted `three`s replaced. And here we have our first lesson. Be specific. We only want to match when it's only the word `three`. So we need to beef up this regex a little. We only want to find the `three` when it's the first word in a sentence, has white space before and after it or some punctuation before and/or after it, or if it's the last word in a sentence. With that criteria, the regex might look like this now.

```javascript
{% raw %}
const reMatchThree = /\b(three)\b/g
{% endraw %}
```

Note: Don't worry if you're not familiar with all the syntax. The `\b` character means a [word boundary character](https://regular-expressions.mobi/wordboundaries.html?wlr=1).

When parts of a regex are contained by parentheses, it means a [group](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Ranges#using_groups), and what's in that group will return as a group as part of the match.

## Don't Be Too Greedy

Greed is usually not a good thing and greed in regex is no exception. Let's say you're tasked with finding all the text snippets between double quotes. For the sake of this example, we are going to assume the happy path, i.e. no double quoted strings withing double quoted strings.

You set out to build your regex. 

```javascript
{% raw %}
const reMatchBetweenDoubleQuotes = /"(.+)"/g
{% endraw %}
```

Remember that `(` and `)` represent a group. The `.` character means any character. Another special character is  `+`. It means at least one character. 

You're feeling good and you run this regex over the file you need to extract the texts from.

```text
{% raw %}
Hi there "this text is in double quotes". As well, "this text is in double quotes too".
{% endraw %}
```

The results come in and here are the texts that the regex matched for texts within double quotes:

`this text is in double quotes". As well, "this text is in double quotes too`

Wait a minute!? That's not what you were expecting. There are clearly two sets of text within double quotes, so what went wrong? Lesson number two. Don't be greedy.

If we look again at the regex you created, it contains `.+` which means literally match any character as many times as possible, which is why we end up matching only `this text is in double quotes". As well, "this text is in double quotes too` because `"` is considered any character. You got greedy, or more specifically the regex did.

There are a couple of ways to approach this. We can use the non-greedy version of `+`, by replacing it with `+?`

```javascript
{% raw %}
const reMatchBetweenDoubleQuotes = /"(.+?)"/g
{% endraw %}
```

Which means find a `"`, start a capturing group then find as many characters as possible before you hit a `"`

Another approach, which I prefer, is the following:

```javascript
{% raw %}
const reMatchBetweenDoubleQuotes = /"([^"]+)"/g
{% endraw %}
```

Which means find a `"`, start a capturing group then find as many characters as possible that aren't `"` before you hit a `"`.

Note: We've introduced some more special characters. `[` and `]` are a way to say match any of the following characters. In our use case, we're using it with `^`, i.e. `[^`, to say do not match any of the following things. In our case, we're saying do not match the `"` character.

## Focus on What You’re Searching For

Now that we’ve gone through some common pitfalls, it’s worth noting that it’s OK to be greedy or not be as specific. The main thing I want you to take away is to really think about what you’re searching for and how much you want to find.

Regexes are super powerful for manipulating text, and now you’re armed with some knowledge you can put in your regex tool belt! Until next time folks!

## Resources

- [regex101.com](https://regex101.com)
- [regular-expressions.info](https://www.regular-expressions.info)
- [Mastering Regular Expression 3rd Edition](https://www.oreilly.com/library/view/mastering-regular-expressions/0596528124/)
- [Regular Expressions | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [regexper](https://regexper.com/) (Thanks @link2twenty!)
- [VerbalExpressions](https://github.com/VerbalExpressions) repository (Thanks @citizen428!)
