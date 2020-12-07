---
stackbit_url_path: posts/ink-react-for-clis-2l3b
title: 'Ink: React for CLIs'
date: '2019-03-09T21:34:54.000Z'
excerpt: >-
  Photo by Pierre Bamin on Unsplash  This one is short and sweet.  Are you
  familiar with React? Then yo...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--yzFlGYUf--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/ewrl8i5l3v9avgxpocjc.jpg
comments_count: 3
positive_reactions_count: 50
tags:
  - githunt
  - react
  - cli
canonical_url: 'https://www.iamdeveloper.com/posts/ink-react-for-clis-2l3b/'
template: post
---


Photo by [Pierre Bamin](https://unsplash.com/photos/-ltjzTfhpCI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

This one is short and sweet.

Are you familiar with React? Then you know Ink. I haven't tried this out yet, but basically it's a [custom React renderer](https://github.com/nitin42/Making-a-custom-React-renderer) that allows you to build beautiful CLIs.


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fvadimdemedes%2Fink" style="border: 0; width: 100%;"></iframe>


Flexbox in a CLI? 🤯 React hooks in a CLI? YOLO my friend, YOLO.

<center>
![Holy Forking Shirt!](https://media.giphy.com/media/xT0xeGWDzEfcsd8QzC/giphy.gif)
</center>

Here's a little example straight from the repository's ReadME:


```javascript
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
```


And here's the author of Gatsby working on a build flow using Ink.


<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1104163517945397249" style="border: 0; width: 100%;"></iframe>


The jest example is also very cool.


<iframe class="liquidTag" src="https://dev.to/embed/replit?args=%40vadimdemedes%2Fink-jest-demo" style="border: 0; width: 100%;"></iframe>


Even the folks at npm think it's kinda cool.


<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1103347697107361792" style="border: 0; width: 100%;"></iframe>


Vadim, the author of Ink has a great intro post to it, [Building rich command-line interfaces with Ink and React](https://vadimdemedes.com/posts/building-rich-command-line-interfaces-with-ink-and-react).

So what are you going to build with Ink? 😉

Happy coding!

*[This post is also available on DEV.](https://dev.to/nickytonline/ink-react-for-clis-2l3b)*


<script>
const parent = document.getElementsByTagName('head')[0];
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.1.1/iframeResizer.min.js';
script.charset = 'utf-8';
script.onload = function() {
    window.iFrameResize({}, '.liquidTag');
};
parent.appendChild(script);
</script>    
