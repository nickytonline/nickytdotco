---json
{
  "title": "Ink: React for CLIs",
  "excerpt": "This one is short and sweet.  Are you familiar with React? Then you know Ink. I haven't tried this...",
  "date": "2019-03-09T21:34:54.000Z",
  "tags": [
    "react",
    "cli"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--yzFlGYUf--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__thepracticaldev.s3.amazonaws.com_i_ewrl8i5l3v9avgxpocjc.jpg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/ink-react-for-clis-2l3b/",
  "reading_time_minutes": 1,
  "template": "post"
}
---

This one is short and sweet.

Are you familiar with React? Then you know Ink. I haven't tried this out yet, but basically it's a [custom React renderer](https://github.com/nitin42/Making-a-custom-React-renderer) that allows you to build beautiful CLIs.

{% github "https://github.com/vadimdemedes/ink" %}

Flexbox in a CLI? 🤯 React hooks in a CLI? YOLO my friend, YOLO.

<center>
![Holy Forking Shirt!](https://media.giphy.com/media/xT0xeGWDzEfcsd8QzC/giphy.gif)
</center>

Here's a little example straight from the repository's ReadME:

```javascript
{% raw %}
import React, {Component} from 'react';
import {render, Color} from 'ink';

class Counter extends Component {
	constructor() {
		super();

		this.state = {
			i: 0
		};
	}

	render() {
		return (
			<Color green>
				{this.state.i} tests passed
			</Color>
		);
	}

	componentDidMount() {
		this.timer = setInterval(() => {
			this.setState({
				i: this.state.i + 1
			});
		}, 100);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}
}

render(<Counter/>);
{% endraw %}
```

Even the folks at npm think it's kinda cool.

{% twitter "1103347697107361792" %}

Vadim, the author of Ink has a great intro post to it, [Building rich command-line interfaces with Ink and React](https://vadimdemedes.com/posts/building-rich-command-line-interfaces-with-ink-and-react).

So what are you going to build with Ink? 😉

Happy coding!

Photo by [Pierre Bamin](https://unsplash.com/photos/-ltjzTfhpCI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
