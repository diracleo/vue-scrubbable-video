# vue-scrubbable-video

Have you ever tried to scrub through an HTML5 `<video>` element by dynamically changing its currentTime property, only to be disappointed by its slow performance and stuttering behavior?

Have you ever wanted to mimic the smooth and responsive video scrubbing-by-scrollbar seen on the [Apple AirPods Pro Website](https://www.apple.com/airpods-pro/), but without the overhead of parsing out JPEG's from your videos and serving them frame-by-frame?

Maybe you've come across this [Reddit discussion](https://www.reddit.com/r/webdev/comments/2krge1/codepens_killer_html5_video_scrolling_controls_w/cq4ndwo?utm_source=share&utm_medium=web2x&context=3) featuring user [markteater](https://www.reddit.com/user/markteater/) who discovered that in order for a video to be scrubbed smoothly, it needs to be encoded with each frame as a keyframe, like this:

```bash

ffmpeg -r 30 -i input.mp4 -vcodec libx264 -crf 15 -g 1 -pix_fmt yuv420p output.mp4

```

Maybe that was your answer. But if you don't want to re-encode your videos with FFMPEG, keep reading. 

This component will, in real time, generate snapshots at every frame of your video and output them as canvases which are then shown or hidden depending on scrub position. 

Simply replace your `<video>` element with a `<scrubbable-video>` component.

[CodePen Demo](https://codepen.io/diracleo/pen/KKzBYgQ)

![](demo1.gif)

## Features

  * Scrub through a video seamlessly without any stuttering
  * Specify sources the same way as with a standard `<video>` element
  * Specify the frames-per-second to balance performance and quality
  * Specify a start and end time to use only a segment of a video
  * Scrubbing is possible even before all frames have been generated
  * Connect your own scrubbing controller or tether playback to a scrollbar

![](demo2.gif)

## Requirements

- [Vue.js](https://github.com/vuejs/vue)

## Installation

### npm

```bash

npm install @diracleo/vue-scrubbable-video

```

### external script

```html

<script src="https://unpkg.com/@diracleo/vue-scrubbable-video/dist/vue-scrubbable-video.min.js"></script>

```

## Usage

### javascript

```javascript

import Vue from 'vue'
import App from './App.vue'
import ScrubbableVideo from '@diracleo/vue-scrubbable-video';

Vue.use(ScrubbableVideo)

new Vue({
  el: 'body',
  components: {
    App
  }
})

```

### template

```html

<scrubbable-video :current-progress="myVar" :frames-per-second="10">
  <source src="/path/to/your/video.mp4" type="video/mp4" />
  <source src="/path/to/your/video.webm" type="video/webm" />
</scrubbable-video>

```

*In this example, you will need to set the value of the "myVar" as a number representing the scrub position of the video in percentage form (0 to 100). A typical use case would involve providing this variable as the [v-model](https://vuejs.org/v2/guide/forms.html#number) of a [Slider HTML Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range)*

*If you are using the component from the externally-included script instead of the modular form, the component name will be `<vue-scrubbable-video>` instead of `<scrubbable-video>`. See the [CodePen Demo](https://codepen.io/diracleo/pen/KKzBYgQ) for an example of this type of usage.*

[scrollmagic.io](https://scrollmagic.io/) is a great library if you want your video scrubbing to be controlled by a scrollbar. The [CodePen Demo](https://codepen.io/diracleo/pen/KKzBYgQ) is an example of this integration.

## Properties

| Property           | Type                        | Default           | Required | Description                              |
| ------------------ | --------------------------- | ----------------- | -------- | ---------------------------------------- |
| current-progress   | Number (min: 0, max: 100)   | 0                 | *no*     | Percentage-based current scrubbed position                             |
| frames-per-second  | Number (min: 0)             | 10                | *no*     | Granularity of frame-snapshotting                                      |
| start              | Number (min: 0)             | 0                 | *no*     | Where, in seconds, the segment will start (omit to use entire video)   |
| end                | Number (min: start)         | duration of video | *no*     | Where, in seconds, the segment will end (omit to use entire video)     |


## Events

| Name                  | Arguments                                | Description                                          |
| --------------------- | ---------------------------------------- | ---------------------------------------------------- |
| **frame-unavailable** | Number                                   | Fired when an unready frame has been scrubbed-to     |
| **frame-shown**       | Number                                   | Fired when a ready frame has been scrubbed-to        |
| **frames-generating** | None                                     | Fired when frame generating has begun                |
| **frame-ready**       | Number                                   | Fired when a frame has been generated                | 
| **frames-ready**      | None                                     | Fired when all frames have been generated            | 